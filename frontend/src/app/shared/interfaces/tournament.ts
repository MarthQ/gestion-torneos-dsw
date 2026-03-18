import { Game } from './game';
import { Inscription } from './inscription';
import { Location } from './location';
import { Tag } from './tag';
import { User } from './user';

export interface TournamentFormDTO {
  id: number;
  name: string;
  description: string;
  datetimeinit: Date;
  status: string;
  creator: number;
  game: number;
  location: number;
  maxParticipants: number;
  tags: number[];
}

export interface Tournament {
  id: number;
  name: string;
  description: string;
  datetimeinit: Date;
  status: string;
  creator: User;
  game: Game;
  location: Location;
  maxParticipants: number;
  tags: Tag[];
  inscriptions?: Inscription[];
}
