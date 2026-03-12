import { Game } from './game';
import { Location } from './location';
import { Tag } from './tag';
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
  tags: Tag[];
}
