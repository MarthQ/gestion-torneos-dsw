import { Routes } from '@angular/router';
import { GameCrud } from './cruds/game/game-crud';
import { GameTypeCrud } from './cruds/game-type/game-type-crud';
import { LocationCrud } from './cruds/location/location-crud';
import { TournamentCrud } from './cruds/tournament/tournament-crud';
import { UserCrud } from './cruds/user/user-crud';

export const adminRoutes: Routes = [
  {
    path: 'crud',
    loadChildren: () => import('./cruds/crud.routes').then((m) => m.crudRoutes),
  },
  {
    path: '**',
    redirectTo: 'crud',
  },
];
