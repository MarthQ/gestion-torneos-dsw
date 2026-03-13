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
import { Tournament } from '../tournament/tournament.entity.js'

@Entity()
export class Game extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string
    @Property()
    description!: string
    @Property()
    imgUrl?: string
    @Property({ unique: true })
    igdbId!: number
    @OneToMany(() => Tournament, (tournament) => tournament.game, { cascade: [Cascade.ALL] })
    tournament = new Collection<Tournament>(this)
}
