import { Role } from './role';

export interface User {
  id: number;
  name: string;
  password: string;
  mail: string;
  role: Role;
}
