import { Game } from './game';
import { User } from './user';

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
}
