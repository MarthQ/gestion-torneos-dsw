export interface CrudElement {
  id: number;
  name: string;
}

export interface GameType extends CrudElement {
  description: string;
  tags: Tag[];
}

export interface Tag extends CrudElement {
  description: string;
}

export interface User extends CrudElement {
  password: string;
  mail: string;
  location: Location | null;
}

export interface Location extends CrudElement {}
