import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Game_Type } from '../game_type/game_type.entity.js'
import { Game } from '../game/game.entity.js'
import { Tournament } from '../tournament/tournament.entity.js'

@Entity()
export class Tag extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string

    @Property()
    description!: string

    @ManyToMany(() => Game_Type, (game_type) => game_type.tags)
    gameTypes = new Collection<Game_Type>(this)

    @ManyToMany(() => Game, (game) => game.tags)
    games = new Collection<Game>(this)

    @ManyToMany(() => Tournament, (tournament) => tournament.tags)
    tournaments = new Collection<Tournament>(this)
}
