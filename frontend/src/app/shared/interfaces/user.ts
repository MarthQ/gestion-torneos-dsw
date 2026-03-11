import { Location } from './location';
import { Role } from './role';

export interface User {
  id: number;
  name: string;
  password: string;
  mail: string;
  location: Location;
  role: Role;
}
