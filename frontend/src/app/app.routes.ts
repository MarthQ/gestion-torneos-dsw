import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tournaments',
    loadChildren: () =>
      import('@features/tournaments/tournament.routes').then((m) => m.tournamentsRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'user-profile',
    loadChildren: () => import('@features/user-profile/user-profile.routes').then((m) => m.userProfileRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('@features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '**',
    redirectTo: 'tournaments',
  },
];
