import { Routes } from '@angular/router';
import { TournamentLayout } from './layout/tournamentLayout/tournamentLayout';
import { Overview } from './pages/overview/overview';
import { Bracket } from './pages/bracket/bracket';
import { Configuration } from './pages/configuration/configuration';
import { Participants } from './pages/participants/participants';
import { Wizard } from './pages/wizard/wizard';

export const TournamentRoutes: Routes = [
  {
    path: 'create',
    component: Wizard,
  },
  {
    path: ':id',
    component: TournamentLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        component: Overview,
      },
      {
        path: 'participants',
        component: Participants,
      },
      {
        path: 'bracket',
        component: Bracket,
      },
      {
        path: 'configuration',
        component: Configuration,
      },
    ],
  },
];

export default TournamentRoutes;
