import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    ManyToMany,
    Rel,
    Collection,
    OneToMany,
    Enum,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Game } from '../game/game.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'
import { User } from '../user/user.entity.js'
import { Location } from '../location/location.entity.js'
import { Tag } from '../tag/tag.entity.js'
import { Region } from '../region/region.entity.js'
import { TournamentStatus } from '../shared/interfaces/status.js'
import { TournamentTypeEnum } from '../shared/interfaces/tournamentType.js'

@Entity()
export class Tournament extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string
    @Property({ columnType: 'text' })
    description!: string
    @Property()
    datetimeinit!: Date
    // Open -> Closed -> Running -> Finished -> Canceled
    @Enum({
        items: () => TournamentStatus,
        default: TournamentStatus.OPEN,
    })
    status?: TournamentStatus
    @Property()
    maxParticipants!: number
    @Enum(() => TournamentTypeEnum)
    type!: TournamentTypeEnum
    @ManyToOne(() => User, { nullable: false })
    creator!: Rel<User>
    @ManyToOne(() => Location, { nullable: true })
    location?: Rel<Location>
    @ManyToOne(() => Region, { nullable: true })
    region?: Rel<Region>
    @ManyToOne(() => Game, { nullable: false })
    game!: Rel<Game>
    @OneToMany(() => Inscription, (inscription) => inscription.tournament)
    inscriptions = new Collection<Inscription>(this)

    @ManyToMany(() => Tag, (tag) => tag.tournaments, { owner: true })
    tags = new Collection<Tag>(this)
}
