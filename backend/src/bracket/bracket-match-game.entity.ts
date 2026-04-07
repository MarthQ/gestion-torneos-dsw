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
    stage_id!: number
    @Property()
    group_id!: number
    @Property()
    round_id!: number
    @Property()
    match_id!: number
}
