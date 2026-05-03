import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class BracketMatch extends BaseEntity {
    @Property()
    status!: number
    @Property({ type: 'json', nullable: true })
    opponent1?: any
    @Property({ type: 'json', nullable: true })
    opponent2?: any
    @Property()
    stage_id!: number
    @Property()
    group_id!: number
    @Property()
    round_id!: number
    @Property()
    number!: number
    @Property()
    child_count!: number
}
