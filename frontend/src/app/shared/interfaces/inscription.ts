import { Tournament } from './tournament';
import { User } from './user';

export interface Inscription {
  id: number;
  nickname: string;
  tournament: Tournament;
  inscriptionDate: Date;
  user: User;
}
