import {
    Entity,
    Property,
    ManyToMany,
    Collection
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
    @ManyToMany(() => Tournament, (tournament) => tournament.inscriptions, { owner: true })
    tournament!: Tournament[]
    @ManyToMany(() => User, (user) => user.inscriptions, { owner: true })
    user!: User[]
}