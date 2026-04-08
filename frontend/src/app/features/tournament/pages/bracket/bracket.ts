import { Component, ViewChild, ElementRef, inject, signal, effect, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { TournamentService } from '@shared/services/tournament.service';
import { JsonPipe } from '@angular/common';
import { Toaster } from '@shared/utils/toaster';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  imports: [JsonPipe],
  templateUrl: './bracket.html',
})
export class Bracket {
  private bracketContainer = viewChild.required<ElementRef>('bracketContainer');

  private activatedRoute = inject(ActivatedRoute);
  private tournamentService = inject(TournamentService);
  private tournamentId = signal(this.activatedRoute.parent?.snapshot.paramMap.get('id'));

  private tournamentData = signal({});

  // tournamentResource = rxResource({
  //   params: () => ({ tournamentId: this.tournamentId() }),
  //   stream: ({ params }) => {
  //     return this.tournamentService.getTournamentBracket(+params.tournamentId!).pipe(
  //       tap((data) => {
  //         if (!data?.match?.length) {
  //           console.log('[Bracket] No data or empty matches:', data);
  //           return;
  //         }
  //         console.log('[Bracket] Rendering with data:', data);
  //         this.tournamentData.set(data);
  //         // await this.renderBracket(data);
  //         const container = this.bracketContainer()?.nativeElement;
  //         if (!container) return;
  //         try {
  //           (window as any).bracketsViewer.render(
  //             {
  //               stages: data.stage,
  //               matches: data.match,
  //               matchGames: data.match_game,
  //               participants: data.participant,
  //             },
  //             {
  //               separatedChildCountLabel: true,
  //             },
  //           );
  //         } catch (err) {
  //           console.error('[Bracket] Render error:', err);
  //         }
  //       }),
  //     );
  //   },
  // });

  addResult() {
    this.tournamentService.reportMatchResult(8, '2-1').subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (message) => {
        Toaster.error(message);
        console.log(message);
      },
    });
  }

  getMatches() {
    this.tournamentService.getStageMatches((this.tournamentData() as any).stage[0].id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (message) => {
        Toaster.error(message);
        console.log(message);
      },
    });
  }

  closeInscription() {
    if (!this.tournamentId()) return;
    this.tournamentService.closeInscriptions(this.tournamentId()!).subscribe({
      next: (data) => {
        console.log(data);
        (window as any).bracketsViewer.render(data.data);
      },
      error: (message) => {
        Toaster.error(message);
      },
    });
  }
}
