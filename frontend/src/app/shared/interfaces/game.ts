import { GameType } from './game-type';

export interface Game {
  id: number;
  name: string;
  game_type: GameType;
}
