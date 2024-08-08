export interface GameType {
  id: number;
  name: string;
  description: string;
  [key: string]: string | number;
}
