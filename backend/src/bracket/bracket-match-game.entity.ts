import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class BracketMatchGame extends BaseEntity {
    @Property()
    number!: number
    @Property()
    childCount!: number
    @Property({ type: 'json', nullable: true })
    opponent1?: any
    @Property({ type: 'json', nullable: true })
    opponent2?: any
    @Property()
    status!: number
    @Property()
    stageId!: number
    @Property()
    groupId!: number
    @Property()
    roundId!: number
    @Property()
    matchId!: number
}
