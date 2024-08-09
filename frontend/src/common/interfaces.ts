export interface GameType {
  id: number;
  name: string;
  description: string;
  tags: string;
  [key: string]: string | number;
}
