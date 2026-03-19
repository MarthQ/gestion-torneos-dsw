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
    path: 'tournament/:id',
    loadChildren: () =>
      import('@features/tournaments/tournament-page/tournament-page.routes').then(
        (m) => m.tournamentsPageRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: 'explore',
  },
];
