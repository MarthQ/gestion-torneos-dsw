import { DatePipe, I18nSelectPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '@shared/services/tournament.service';
import { Toaster } from '@shared/utils/toaster';
import { TournamentUtils } from '@shared/utils/tournament-utils';
import { map, tap } from 'rxjs';

@Component({
  imports: [I18nSelectPipe, DatePipe],
  templateUrl: './overview.html',
})
export class Overview {
  activatedRoute = inject(ActivatedRoute);
  tournamentId = signal(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
  getBackgroundStyle = TournamentUtils.GetGameImage;
  tournamentStatusMap = TournamentUtils.tournamentStatusMap;

  private tournamentService = inject(TournamentService);

  closeInscription() {
    if (!this.tournamentId()) return;
    this.tournamentService.closeInscriptions(this.tournamentId()!).subscribe({
      next: (bracketManagerTournament) => {
        Toaster.success(`Bracket generated succesfully`);
        console.log({ bracketManagerTournament });
      },
      error: (message) => {
        Toaster.error(message);
      },
    });
  }

  tournamentResource = rxResource({
    params: () => ({ id: this.tournamentId() }),
    stream: ({ params }) => {
      const tournamentId = Number(params.id);

      return this.tournamentService
        .getTournament(tournamentId)
        .pipe(tap((response) => console.log(response)));
    },
  });
}
