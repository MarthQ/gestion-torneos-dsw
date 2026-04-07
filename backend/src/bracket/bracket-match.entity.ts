import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core'
import { Tournament } from '../tournament/tournament.entity.js'
import { BracketGroup } from './bracket-group.entity.js'
import { BracketRound } from './bracket-round.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class BracketMatch extends BaseEntity {
    @Property()
    number!: number
    @Property()
    stage_id!: number
    @Property()
    group_id!: number
    @Property()
    round_id!: number
    @Property({ type: 'json', nullable: true })
    opponent1?: any
    @Property({ type: 'json', nullable: true })
    opponent2?: any
    @Property()
    status!: number
    @Property()
    childCount!: number
}
