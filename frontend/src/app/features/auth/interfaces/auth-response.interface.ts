import { User } from '@shared/interfaces/user';

export interface AuthResponse {
  message: string;
  data: Data;
}

export interface Data {
  user: User;
  token: string;
}
