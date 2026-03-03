import { Routes } from '@angular/router';
import { Explore } from './explore/explore';
import { MyInscriptions } from './my-inscriptions/my-inscriptions';

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
    path: '**',
    redirectTo: 'explore',
  },
];
