export interface CrudElement {
  id: number;
}

export interface GameType extends CrudElement {
  name: string;
  description: string;
  tags: Tag[];
}

export interface Tag extends CrudElement {
  name: string;
  description: string;
}

export interface Inscription extends CrudElement {
  user: User | null;
  tournament: Tournament | null;
  score: number;
  ranking: number;
  inscriptiondate: Date;
}

export interface User extends CrudElement {
  name: string;
  password: string;
  mail: string;
  location: Location | null;
}

export interface Location extends CrudElement {
  name: string;
}

export interface Tournament extends CrudElement {
  name: string;
  description: string;
  game: Game;
  startdate: Date;
  maxParticipants: number;
  status: string;
  inscriptions: Inscription[];
}

export interface Game extends CrudElement {
  name: string;
  cant_torneos: number;
  gametype: GameType | null;
  tags: string[];
}
