export interface CrudElement {
  id: number;
  [key: string]: number | string;
}

export interface GameType extends CrudElement {
  name: string;
  description: string;
  tags: string;
}
