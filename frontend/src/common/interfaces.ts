export interface CrudElement {
  id: number;
  [key: string]: number | string;
}

export interface GameType extends CrudElement {
  id: number;
  name: string;
  description: string;
  tags: string;
}
