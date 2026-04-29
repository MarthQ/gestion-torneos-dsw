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
  private url = `${environment.apiUrl}/tournaments/${this.tournamentId()}/bracket/stream`;

  bracketData = signal<any>({});

  isModalOpen = signal<boolean>(false);
  matchData = signal({});

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

    if (this.bracketSource) {
      this.bracketSource.close();
    }

    this.bracketSource = new EventSource(this.url);

    this.bracketSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log(`[SSE] Datos recibidos:`, data);
        // Check if the data received is from a bracket update or a heartbeat
        if (data.stage || data.match) {
          this.renderBracket(data);
          // The bracketData object is updated
          this.bracketData.set(data);
        }
      } catch (e) {
        console.error(`[SSE] Error procesando datos ${e}`);
      }
    };

    this.bracketSource.onerror = (error) => {
      console.error(`[SSE] Error en la conexión:`, error);
    };
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
    if (match.status !== 2 && match.status !== 4) {
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
    if (this.bracketSource) {
      this.bracketSource.close();
      this.bracketSource = null;
      console.log('[SSE] Desconectado al salir del bracket');
    }
  }
}
