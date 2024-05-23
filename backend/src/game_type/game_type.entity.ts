import crypto from 'node:crypto'

export class Game_Type {
    constructor(
        public name: string,
        public description: string,
        // TODO: tags should be a string array.
        public tags: string,
        public _id?: number
    ) {}
}
