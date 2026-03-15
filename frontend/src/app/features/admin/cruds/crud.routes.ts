import { Routes } from '@angular/router';
import { GameCrud } from './game/game-crud';
import { LocationCrud } from './location/location-crud';
import { TournamentCrud } from './tournament/tournament-crud';
import { UserCrud } from './user/user-crud';
import { TagCrud } from './tag/tag-crud';
import { RoleCrud } from './role/role-crud';

export const crudRoutes: Routes = [
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
