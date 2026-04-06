import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core'
import { Tournament } from '../tournament/tournament.entity.js'
import { BracketGroup } from './bracket-group.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { BracketStage } from './bracket-stage.entity.js'

@Entity()
export class BracketRound extends BaseEntity {
    @Property()
    number!: number
    @Property()
    stageId!: number
    @Property()
    groupId!: number
}
