import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Tournament } from '../tournament/tournament.entity.js'
import { User } from '../user/user.entity.js'

@Entity()
export class Inscription extends BaseEntity {
    @Property()
    victories!: number
    @Property()
    loses!: number
    @Property()
    inscriptionDate!: Date
    @ManyToOne(() => Tournament, { nullable: false })
    tournament!: Rel<Tournament>
    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>
}
