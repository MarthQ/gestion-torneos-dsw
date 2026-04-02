import { Routes } from '@angular/router';
import { Explore } from './pages/explore/explore';
import { MyInscriptions } from './pages/my-inscriptions/my-inscriptions';
import { UserProfile } from './pages/user-profile/user-profile';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthenticatedGuard } from '@features/auth/guards/authenticated.guard';
import { SetupPassword } from './pages/setup-password';

export const TournamentHubRoutes: Routes = [
  {
    path: '',
    component: MainLayout,

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
        path: 'setup-password',
        component: SetupPassword,
      },
      {
        path: 'admin',
        canMatch: [AuthenticatedGuard],
        loadChildren: () => import('../admin/admin.routes'),
      },
    ],
  },
];

export default TournamentHubRoutes;
