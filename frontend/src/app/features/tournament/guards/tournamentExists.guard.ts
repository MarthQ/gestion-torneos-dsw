import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivateFn } from '@angular/router';
import { TournamentService } from '@shared/services/tournament.service';
import { Toaster } from '@shared/utils/toaster';
import { catchError, map, of } from 'rxjs';

export const tournamentExistsGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const tournamentService = inject(TournamentService);
  const tournamentId = Number(route.paramMap.get('id'));

  const router = inject(Router);

  if (isNaN(tournamentId) || tournamentId <= 0) {
    Toaster.error('El torneo que has buscado no existe.');
    return router.createUrlTree([`/explore`]);
  }

  return tournamentService.getTournament(tournamentId).pipe(
    map(() => true),

    // If tournament is not found, an error pops
    catchError(() => {
      Toaster.error('El torneo que has buscado no existe.');
      return of(router.createUrlTree([`/explore`]));
    }),
  );
};
