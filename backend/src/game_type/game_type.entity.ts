import crypto from 'node:crypto'

export class Game_Type {
    constructor(
        public name: string,
        public description: string,
        public tags: string[],
        public _id?: number,
    ) {}
}
