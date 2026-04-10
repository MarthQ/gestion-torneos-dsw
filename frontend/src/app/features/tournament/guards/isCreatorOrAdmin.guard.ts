import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '@features/auth/services/auth.service';
import { TournamentService } from '@shared/services/tournament.service';

export const isCreatorOrAdminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const tournamentService = inject(TournamentService);

  const router = inject(Router);
  const tournamentId = Number(route.parent?.paramMap.get('id'));

  const user = authService.user();

  if (!user) {
    return router.createUrlTree([`/auth/login`]);
  }

  if (user.role.name === 'admin') {
    return true;
  }

  // If the logged user is the creator of the tournament, access to configuration is permitted. If not, it gets redirected to overview
  // * Change doing a http request to saving the tournament in cache
  return tournamentService.getTournament(tournamentId).pipe(
    map((tournament) => tournament.bracketData),
    map((tournament) =>
      tournament.creator.id === user.id
        ? true
        : router.createUrlTree(['/tournament', tournamentId, 'overview']),
    ),
    catchError(() => of(router.createUrlTree(['/tournament', tournamentId, 'overview']))),
  );
};
