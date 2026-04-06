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
import { Inscription } from '../inscription/inscription.entity.js'
import { User } from '../user/user.entity.js'
import { Location } from '../location/location.entity.js'
import { Tag } from '../tag/tag.entity.js'
import { Region } from '../region/region.entity.js'

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
    @Property()
    maxParticipants!: number
    //TODO cambiar de tipo string a 'single_elimination' | 'double_elimination'
    @Property({ default: 'single_elimination' })
    type!: string
    @ManyToOne(() => User, { nullable: false })
    creator!: Rel<User>
    @ManyToOne(() => Location, { nullable: false })
    location!: Rel<Location>
    @ManyToOne(() => Region, { nullable: true })
    region?: Rel<Region>
    @ManyToOne(() => Game, { nullable: false })
    game!: Rel<Game>
    @OneToMany(() => Inscription, (inscription) => inscription.tournament)
    inscriptions = new Collection<Inscription>(this)

    @ManyToMany(() => Tag, (tag) => tag.tournaments, { owner: true })
    tags = new Collection<Tag>(this)
}
