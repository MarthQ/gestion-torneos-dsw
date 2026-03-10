import { Routes } from '@angular/router';
import { GameTypeCrud } from './game-type/game-type-crud';
import { GameCrud } from './game/game-crud';
import { LocationCrud } from './location/location-crud';
import { TournamentCrud } from './tournament/tournament-crud';
import { UserCrud } from './user/user-crud';
import { TagCrud } from './tag/tag-crud';

export const crudRoutes: Routes = [
  {
    path: 'game',
    component: GameCrud,
  },
  {
    path: 'game-type',
    component: GameTypeCrud,
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
    path: '**',
    redirectTo: 'game',
  },
];
