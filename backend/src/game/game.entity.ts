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
    // To permit longer than 255 characters texts we set the column type as text.
    @Property({ columnType: 'text' })
    description!: string
    @Property({ nullable: true })
    imgId?: string
    @Property({ unique: true })
    igdbId!: number
    @OneToMany(() => Tournament, (tournament) => tournament.game, { cascade: [Cascade.ALL] })
    tournament = new Collection<Tournament>(this)
}
