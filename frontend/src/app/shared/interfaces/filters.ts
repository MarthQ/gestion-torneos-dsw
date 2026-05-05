import { Game } from './game';
import { Location } from './location';
import { Role } from './role';
import { Tag } from './tag';
import { TournamentStatus } from './tournamentStatus';

export interface Filters {
  locations?: Location[];
  roles?: Role[];
  tags?: Tag[];
  games?: Game[];
  status?: TournamentStatus[];
}

export interface QueryFilter {
  location?: Location;
  role?: Role;
  tag?: Tag;
  game?: Game;
  status?: TournamentStatus;
}
