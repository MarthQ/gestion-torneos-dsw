import { Tournament } from '@features/tournaments/tournament-page/tournament-page';
import { User } from './user';

export interface Inscription {
  id: number;
  nickname: string;
  inscriptionDate: Date;
  points: number;
  tournament?: Tournament;
  user?: User;
}
