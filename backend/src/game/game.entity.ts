import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    ManyToMany,
    OneToMany,
    Cascade,
    Collection,
    Rel,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Game_Type } from '../game_type/game_type.entity.js'
import { Tournament } from '../tournament/tournament.entity.js'
import { Tag } from '../tag/tag.entity.js'

@Entity()
export class Game extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string
    @ManyToOne(() => Game_Type, { nullable: false })
    gametype!: Rel<Game_Type>
    @ManyToMany(() => Tag, (tag) => tag.games, { owner: true })
    tags = new Collection<Tag>(this)
    @OneToMany(() => Tournament, (tournament) => tournament.game, { cascade: [Cascade.ALL] })
    tournament = new Collection<Tournament>(this)
}
