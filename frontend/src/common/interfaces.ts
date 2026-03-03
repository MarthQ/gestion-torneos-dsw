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
  tournament: Tournament | number | null;
  victories: number;
  loses: number;
  nickname: string;
  // Sometimes we use dates.toISOString() so its convenient to also make it accept string
  inscriptionDate: Date | string | null;
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
  game: Game | null;
  datetimeinit: Date | null;
  status: string;
  inscriptions: Inscription[];
  tags: Tag[];
}
