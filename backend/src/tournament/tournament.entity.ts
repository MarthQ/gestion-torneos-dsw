import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    ManyToMany,
    Rel,
    Collection,
    OneToMany,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Game } from '../game/game.entity.js'
import { Tag } from '../tag/tag.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'

@Entity()
export class Tournament extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string
    @Property()
    description!: string
    @Property()
    datetimeinit!: Date
    @Property()
    status!: string
    @ManyToOne(() => Game, { nullable: false })
    game!: Rel<Game>
    @ManyToMany(() => Tag, (tag) => tag.tournaments, { owner: true })
    tags = new Collection<Tag>(this)
    @OneToMany(() => Inscription, (inscription) => inscription.tournament)
    inscriptions = new Collection<Inscription>(this)
}
