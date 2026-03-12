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

@Entity()
export class Game extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string
    @Property()
    description!: string
    @Property()
    imgUrl?: string
    @Property()
    igdbId!: number
    @ManyToOne(() => Game_Type, { nullable: false })
    gametype!: Rel<Game_Type>
    @OneToMany(() => Tournament, (tournament) => tournament.game, { cascade: [Cascade.ALL] })
    tournament = new Collection<Tournament>(this)
}
