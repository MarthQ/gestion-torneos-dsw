import { Tournament } from './tournament';
import { User } from './user';

export interface Matchup {
  id: number;
  tournament: Tournament;
  player1Id: User;
  player2Id: User;
  winner_id: User | null;
  player1Rounds: number;
  player2Rounds: number;
  matchStatus: string;
}
