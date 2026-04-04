import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { AUTH_STATUS } from '../interfaces/auth-status.interface';

export const NotAuthenticatedGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.authStatus() === AUTH_STATUS.AUTHENTICATED;

  //TODO: delete console.log
  console.log({ isAuthenticated }, { authStatus: authService.authStatus() });

  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
