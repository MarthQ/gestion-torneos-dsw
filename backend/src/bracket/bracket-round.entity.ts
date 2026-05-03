import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class BracketRound extends BaseEntity {
    @Property()
    number!: number
    @Property()
    stage_id!: number
    @Property()
    group_id!: number
}
