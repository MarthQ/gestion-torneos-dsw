import { Routes } from '@angular/router';
import { TournamentParticipants } from './participants/participants';
import { TournamentPage } from './tournament-page';

export const tournamentsPageRoutes: Routes = [
  {
    path: '',
    component: TournamentPage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'participants',
      },
      {
        path: 'participants',
        component: TournamentParticipants,
      },
      {
        path: 'brackets',
        component: TournamentParticipants,
      },
      {
        path: 'results',
        component: TournamentParticipants,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
