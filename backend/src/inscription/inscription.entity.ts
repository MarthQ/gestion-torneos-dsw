import {
    Entity,
    Property,
    ManyToMany,
    Collection,
    ManyToOne,
    OneToMany,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Tournament } from '../tournament/tournament.entity.js'
import { User } from '../user/user.entity.js'

@Entity()
export class Inscription extends BaseEntity {
    @Property()
    score!: number
    @Property()
    ranking!: string
    @Property()
    inscriptiondate!: Date
    @ManyToOne(() => Tournament, { nullable: false })
    tournament!: Tournament[]
    @ManyToOne(() => User, { nullable: false })
    user!: User[]
}
