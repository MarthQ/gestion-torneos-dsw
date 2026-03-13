import { EntityDTO } from '@mikro-orm/core'
import { Game } from '../../game/game.entity.js'

// Game interface made by MikroORM's DTO
export type GameDTO = EntityDTO<Game>

export interface IGDBGame {
    id: number
    name: string
    summary?: string
    cover?: { url: string }
}
