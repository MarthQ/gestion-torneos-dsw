import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./features/tournament-hub/tournament-hub.routes'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
