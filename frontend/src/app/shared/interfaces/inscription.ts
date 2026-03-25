import { Tournament } from './tournament';
import { User } from './user';

export interface Inscription {
  id: number;
  nickname: string;
  inscriptionDate: Date;
  points: number;
  tournament?: Tournament;
  user?: User;
}

export interface InscriptionDTO {
  id: number;
  nickname: string;
  inscriptionDate: Date;
  points: number;
  tournament: number;
  user: number;
}
