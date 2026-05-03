import { Game } from './game';
import { Inscription } from './inscription';
import { Location } from './location';
import { Region } from './region';
import { Tag } from './tag';
import { User } from './user';

export interface TournamentFormDTO {
  id: number;
  name: string;
  description: string;
  datetimeinit: Date;
  status?: string;
  creator?: number;
  game: number;
  location?: number;
  region?: number;
  maxParticipants: number;
  tags: number[];
  type?: string;
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
  region: Region;
  maxParticipants: number;
  inscriptions: Inscription[];
  tags: Tag[];
  type: string;
}
