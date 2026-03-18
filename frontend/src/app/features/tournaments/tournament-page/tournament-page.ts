import { DatePipe, I18nSelectPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '@services/tournament.service';
import { getTournamentBackgroundStyle, TournamentStatusMap } from '@shared/utils/tournament-styles';

@Component({
  selector: 'tournament-page',
  imports: [I18nSelectPipe, DatePipe],
  templateUrl: './tournament-page.html',
})
export class Tournament {
  tournamentStatusMap = TournamentStatusMap;
  getBackgroundStyle = getTournamentBackgroundStyle;

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  tournamentService = inject(TournamentService);

  tournamentId = this.activatedRoute.snapshot.queryParamMap.get('id') ?? '';

  tournamentResource = rxResource({
    params: () => ({ id: this.tournamentId }),
    stream: ({ params }) => {
      if (!params.id) {
        this.router.navigate(['tournaments/explore']);
      }

      const tournamentId = Number(params.id);

      return this.tournamentService.getTournament(tournamentId);
    },
  });
}
