import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '@shared/services/tournament.service';
import { Toaster } from '@shared/utils/toaster';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { MatchModal } from '@features/tournament/components/match-modal/match-modal';

@Component({
  imports: [MatchModal],
  templateUrl: './bracket.html',
})
export class Bracket {
  private activatedRoute = inject(ActivatedRoute);
  private tournamentId = signal(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
  private tournamentService = inject(TournamentService);
  isModalOpen = signal<boolean>(false);
  matchData = signal({});

  tournamentResource = rxResource({
    params: () => ({ tournamentId: this.tournamentId() }),
    stream: ({ params }) => {
      return this.tournamentService
        .getTournamentBracket(+params.tournamentId!)
        .pipe(tap((data) => this.renderBracket(data)));
    },
  });

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
    if (match.status !== 2) {
      Toaster.error('No se puede registrar el resultado de este Match');
      return;
    }

    const { participant } = this.tournamentService.bracketData();
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
        next: () => {
          this.refreshView();
        },
        error: (message) => {
          Toaster.error(message);
          console.log(message);
        },
      });
  }

  refreshView() {
    console.log(this.tournamentService.bracketData().match.filter((m: any) => m.status !== 0));
    this.tournamentService.getTournamentBracket(+this.tournamentId()!).subscribe({
      next: (data) => {
        this.renderBracket(data);
      },
    });
  }
}
