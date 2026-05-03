import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class BracketParticipant extends BaseEntity {
    @Property()
    name!: string
    @Property()
    tournament_id!: number
}
