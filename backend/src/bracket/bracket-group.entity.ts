import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { BracketStage } from './bracket-stage.entity.js'

@Entity()
export class BracketGroup extends BaseEntity {
    @Property()
    number!: number
    @Property()
    stage_id!: number
}
