import { Routes } from '@angular/router';
import { TournamentParticipants } from './participants/participants';
import { TournamentPage } from './tournament-page';
import { Brackets } from './brackets/brackets';

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
        component: Brackets,
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
