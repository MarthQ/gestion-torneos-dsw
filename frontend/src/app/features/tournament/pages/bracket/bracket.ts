import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '@shared/services/tournament.service';
import { Toaster } from '@shared/utils/toaster';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatchModal } from '@features/tournament/components/match-modal/match-modal';
import { environment } from 'src/environments/environment';

@Component({
  imports: [MatchModal],
  templateUrl: './bracket.html',
})
export class Bracket implements OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private tournamentId = signal(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
  private tournamentService = inject(TournamentService);
  private bracketSource: EventSource | null = null;
  private abortController: AbortController | null = null;
  private url = `${environment.apiUrl}/tournaments/${this.tournamentId()}/bracket/stream`;

  bracketData = signal<any>({});

  isModalOpen = signal<boolean>(false);
  matchData = signal<any>({});

  isCreator = toSignal(this.tournamentService.isLoggedUserCreator(Number(this.tournamentId())), {
    initialValue: false,
  });

  constructor() {
    this.connectToSSE();
  }

  tournamentResource = rxResource({
    params: () => ({ id: this.tournamentId() }),
    stream: ({ params }) => {
      const tournamentId = Number(params.id);

      return this.tournamentService
        .getTournament(tournamentId)
        .pipe(map((response) => response.tournamentData));
    },
  });

  connectToSSE() {
    const id = this.tournamentId();
    if (!id) return;

    // Close existing connection if any
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.bracketSource) {
      this.bracketSource.close();
      this.bracketSource = null;
    }

    this.abortController = new AbortController();

    // Use fetch API instead of EventSource to have full control over credentials
    const fetchOptions = {
      method: 'GET',
      credentials: 'include' as RequestCredentials, // Send cookies for CORS with credentials
      headers: {
        'Accept': 'text/event-stream',
      },
      signal: this.abortController.signal,
    };

    fetch(this.url, fetchOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const read = () => {
          reader?.read().then(({ done, value }) => {
            if (done) {
              console.log('[SSE] Connection closed by server');
              this.reconnectSSE();
              return;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            // Keep the last potentially incomplete line in the buffer
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr && dataStr !== '') {
                  try {
                    const data = JSON.parse(dataStr);
                    console.log(`[SSE] Datos recibidos:`, data);
                    if (data && (data.stage || data.match)) {
                      this.renderBracket(data);
                      this.bracketData.set(data);
                    }
                  } catch (e) {
                    console.error(`[SSE] Error procesando datos:`, e);
                  }
                }
              } else if (line.startsWith(': heartbeat')) {
                console.log('[SSE] Heartbeat received');
              }
            }

            read(); // Continue reading
          }).catch((err) => {
            if (err.name !== 'AbortError') {
              console.error('[SSE] Read error:', err);
              this.reconnectSSE();
            }
          });
        };

        read();
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('[SSE] Fetch error:', err);
          this.reconnectSSE();
        }
      });
  }

  private reconnectSSE() {
    console.log('[SSE] Intentando reconectar en 5 segundos...');
    setTimeout(() => {
      this.connectToSSE();
    }, 5000);
  }

  isClosed = computed(() => this.tournamentResource.value()?.status === 'closed');

  renderBracket(bracketData: any) {
    console.log('[Bracket] Rendering with data:', bracketData);

    try {
      (window as any).bracketsViewer.render(
        {
          stages: bracketData.stage || [],
          matches: bracketData.match || [],
          matchGames: bracketData.match_game || [],
          participants: bracketData.participant || [],
        },
        {
          onMatchClick: (match: any) => {
            this.handleMatchModal(match);
          },
          clear: true,
          separatedChildCountLabel: true,
        },
      );
    } catch (err) {
      console.error('[Bracket] Render error:', err);
    }
  }

  handleMatchModal(match: any) {
    const isLastMatch = this.bracketData().match.at(-1).id === match.id;

    if (match.status !== 2 && match.status !== 4 && !isLastMatch) {
      Toaster.error('No se puede registrar el resultado de este Match');
      return;
    }

    const { participant } = this.bracketData();
    const opponent1 = participant.find((p: any) => p.id === match.opponent1.id);
    const opponent2 = participant.find((p: any) => p.id === match.opponent2.id);

    this.matchData.set({
      matchId: match.id,
      opponent1,
      opponent2,
    });

    this.isModalOpen.set(true);
  }

  updateMatch(bracketModalResponse: any) {
    const { matchId, scores } = bracketModalResponse;
    this.tournamentService
      .reportMatchResult(Number(this.tournamentId()), matchId, scores)
      .subscribe({
        error: (message) => {
          Toaster.error(message);
          console.log(message);
        },
      });
  }

  reshuffleBracket() {
    this.tournamentService.refreshBracket(+this.tournamentId()!);
  }

  ngOnDestroy() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.bracketSource) {
      this.bracketSource.close();
      this.bracketSource = null;
    }
    console.log('[SSE] Desconectado al salir del bracket');
  }
}
