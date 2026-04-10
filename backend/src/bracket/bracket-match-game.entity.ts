import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class BracketMatchGame extends BaseEntity {
    @Property()
    stage_id!: number
    @Property()
    parent_id!: number
    @Property()
    number!: number
    @Property()
    status!: number
    @Property({ type: 'json', nullable: true })
    opponent1?: any
    @Property({ type: 'json', nullable: true })
    opponent2?: any
}
