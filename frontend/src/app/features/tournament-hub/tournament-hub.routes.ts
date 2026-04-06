import { Routes } from '@angular/router';
import { Explore } from './pages/explore/explore';
import { MyInscriptions } from './pages/my-inscriptions/my-inscriptions';
import { UserProfile } from './pages/user-profile/user-profile';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthenticatedGuard } from '@features/auth/guards/authenticated.guard';
import { SetupPassword } from './pages/setup-password/setup-password';
import { MyTournaments } from './pages/myTournaments/myTournaments';

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
        path: 'my-tournaments',
        canActivate: [AuthenticatedGuard],
        component: MyTournaments,
      },
      {
        path: 'admin',
        canMatch: [AuthenticatedGuard],
        loadChildren: () => import('../admin/admin.routes'),
      },
      {
        path: 'tournament',
        canMatch: [AuthenticatedGuard],
        loadChildren: () => import('../tournament/tournament.routes'),
      },
    ],
  },
];

export default TournamentHubRoutes;
