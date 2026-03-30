import { Routes } from '@angular/router';
import { Explore } from './pages/explore/explore';
import { MyInscriptions } from './pages/my-inscriptions/my-inscriptions';
import { UserProfile } from './pages/user-profile/user-profile';
import { MainLayout } from './layout/main-layout/main-layout';

export const TournamentHubRoutes: Routes = [
  {
    path: '',
    component: MainLayout,
    // canMatch: [AuthenticatedGuard],
    children: [
      {
        path: '',
        redirectTo: 'explore',
        pathMatch: 'full',
      },
      {
        path: 'explore',
        component: Explore,
      },
      {
        path: 'my-inscriptions',
        component: MyInscriptions,
      },
      {
        path: 'profile',
        component: UserProfile,
      },
      {
        path: 'admin',
        loadChildren: () => import('../admin/admin.routes'),
      },
    ],
  },
];

export default TournamentHubRoutes;
