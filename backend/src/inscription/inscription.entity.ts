import { Entity, Property, ManyToOne, Rel, Index } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Tournament } from '../tournament/tournament.entity.js'
import { User } from '../user/user.entity.js'

@Entity()
// Constraint so there exists only one inscription of a certain user to a tournament at a time
@Index({ name: 'unique_user_tournament', properties: ['user', 'tournament'] })
export class Inscription extends BaseEntity {
    @Property()
    nickname!: string
    @Property()
    inscriptionDate!: Date
    @ManyToOne(() => Tournament, { nullable: false })
    tournament!: Rel<Tournament>
    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>
}
