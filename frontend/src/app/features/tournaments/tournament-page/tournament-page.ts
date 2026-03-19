import { DatePipe, I18nSelectPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  Router,
  RouterOutlet,
  RouterLinkWithHref,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TournamentService } from '@services/tournament.service';
import { GetGameImage, TournamentStatusMap } from '@shared/utils/tournament-styles';
import { tap } from 'rxjs';

@Component({
  selector: 'tournament-page',
  imports: [I18nSelectPipe, DatePipe, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tournament-page.html',
})
export class TournamentPage {
  tournamentStatusMap = TournamentStatusMap;
  getBackgroundStyle = GetGameImage;

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  tournamentService = inject(TournamentService);

  tournamentId = this.activatedRoute.snapshot.queryParamMap.get('id') ?? '';
  tournamentCover = signal('');

  tournamentResource = rxResource({
    params: () => ({ id: this.tournamentId }),
    stream: ({ params }) => {
      if (!params.id) {
        this.router.navigate(['tournaments/explore']);
      }

      const tournamentId = Number(params.id);

      return this.tournamentService
        .getTournament(tournamentId)
        .pipe(tap((data) => this.tournamentCover.set(this.getBackgroundStyle(data.game, 'big'))));
    },
  });
}
