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
export interface UserFormDTO {
  id: number;
  name: string;
  password: string;
  mail: string;
  location: number;
  role: number;
}

export interface UserRegisterDTO {
  id?: number;
  name: string;
  password: string;
  mail: string;
  location: number;
  role?: string;
}

export interface UserFormLogin{
  mail:string;
  password: string;
}

