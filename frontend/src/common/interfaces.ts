export interface CrudElement {
  id: number;
}

export interface GameType extends CrudElement {
  name: string;
  description: string;
  tags: Tag[];
}

export interface Game extends CrudElement {
  name: string;
  gametype: GameType | null;
  tags: Tag[];
}

export interface Tag extends CrudElement {
  name: string;
  description: string;
}

export interface Inscription extends CrudElement {
  user: User | null;
  tournament: Tournament | null;
  victories: number;
  loses: number;
  nickname: string;
  // Sometimes we use dates.toISOString() so its convenient to also make it accept string
  inscriptionDate: Date | String | null;
}

export interface User extends CrudElement {
  name: string;
  password: string;
  mail: string;
  location: Location | null;
  inscriptions?: Inscription[];
}

export interface Location extends CrudElement {
  name: string;
}

export interface Tournament extends CrudElement {
  name: string;
  description: string;
  datetimeinit: Date;
  status: string;
  game: Game;
  tags: Tag[];
  inscriptions: Inscription[];
}
