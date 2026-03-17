import { Game } from './game';
import { Location } from './location';
import { Role } from './role';
import { Tag } from './tag';

export interface Filters {
  locations?: Location[];
  roles?: Role[];
  tags?: Tag[];
  games?: Game[];
}

export interface QueryFilter {
  location?: Location;
  role?: Role;
  tag?: Tag;
  game?: Game;
}
