export interface CrudElement {
  id: number;
  name: string;
}

export interface GameType extends CrudElement {
  description: string;
  tags: string[];
}

export interface Game extends CrudElement {
   cant_torneos : number;
   gametype: GameType | null;
   tags: string[];
}

export interface Tag extends CrudElement {
  description: string;
}
