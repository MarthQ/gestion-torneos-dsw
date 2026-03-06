import { Entity, ManyToMany, PrimaryKey, Property, Cascade, OneToMany, Collection } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Game } from '../game/game.entity.js'

@Entity()
export class Game_Type extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string

    @Property({ nullable: false })
    description!: string

    @OneToMany(() => Game, (game) => game.gametype, { cascade: [Cascade.ALL] })
    game = new Collection<Game>(this)
}
