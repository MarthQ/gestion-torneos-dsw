import { Routes } from '@angular/router';
import { GameCrud } from './pages/game/game-crud';
import { LocationCrud } from './pages/location/location-crud';
import { TournamentCrud } from './pages/tournament/tournament-crud';
import { UserCrud } from './pages/user/user-crud';
import { TagCrud } from './pages/tag/tag-crud';
import { RoleCrud } from './pages/role/role-crud';

export const adminRoutes: Routes = [
  {
    path: 'game',
    component: GameCrud,
  },
  {
    path: 'location',
    component: LocationCrud,
  },
  {
    path: 'tournament',
    component: TournamentCrud,
  },
  {
    path: 'user',
    component: UserCrud,
  },
  {
    path: 'tag',
    component: TagCrud,
  },
  {
    path: 'role',
    component: RoleCrud,
  },
  {
    path: '**',
    redirectTo: 'game',
  },
];

export default adminRoutes;
