import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '@shared/services/tournament.service';
import { Toaster } from '@shared/utils/toaster';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  imports: [],
  templateUrl: './bracket.html',
})
export class Bracket {
  private activatedRoute = inject(ActivatedRoute);
  private tournamentService = inject(TournamentService);
  private tournamentId = signal(this.activatedRoute.parent?.snapshot.paramMap.get('id'));

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
          onMatchClick: (match: any) => console.log(match),
          clear: true,
          separatedChildCountLabel: true,
        },
      );
    } catch (err) {
      console.error('[Bracket] Render error:', err);
    }
  }

  matchIndex = signal(0);

  addResult() {
    const matchsId = this.tournamentService
      .bracketData()
      .match.filter((m: any) => m.status === 2)
      .map((m: any) => m.id);
    this.tournamentService.reportMatchResult(matchsId[this.matchIndex()], '2-1').subscribe({
      next: () => {
        //TODO refresh the view? I think we should implement "WebSockets" to render the view before a change like this
        this.matchIndex.set(this.matchIndex() + 1);
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
