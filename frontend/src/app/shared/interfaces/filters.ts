import { Location } from './location';
import { Role } from './role';
import { Tag } from './tag';

export interface Filters {
  locations?: Location[];
  roles?: Role[];
  tags?: Tag[];
}

export interface QueryFilter {
  location?: Location;
  role?: Role;
  tag?: Tag;
}
