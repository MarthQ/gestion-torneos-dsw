import {
    Entity,
    Property,
    ManyToMany
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
    @ManyToMany(() => Tournament, (tournament) => tournament.inscriptions, {nullable:false})
    tournament!: Tournament[]
    @ManyToMany(() => User, (user) => user.inscriptions, {nullable:false})
    user!: User[]
}