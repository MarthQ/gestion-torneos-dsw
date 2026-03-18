import { Routes } from '@angular/router';
import { Explore } from './explore/explore';
import { MyInscriptions } from './my-inscriptions/my-inscriptions';
import { Tournament } from './tournament-page/tournament-page';

export const tournamentsRoutes: Routes = [
  {
    path: 'explore',
    component: Explore,
  },
  {
    path: 'my-inscriptions',
    component: MyInscriptions,
  },
  {
    path: 'tournament',
    component: Tournament,
  },
  {
    path: '**',
    redirectTo: 'explore',
  },
];
