import crypto from 'node:crypto'

export class Game_Type{
  constructor(
    public name:string,
    public description: string,
    public tags: string[],
    public id = crypto.randomUUID() // Esta bien que el id sea asi o lo hacemos un id más simple?
  ) 
    {}
}