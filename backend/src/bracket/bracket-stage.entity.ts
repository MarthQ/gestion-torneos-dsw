import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class BracketStage extends BaseEntity {
    @Property()
    tournamentId!: number

    @Property()
    name!: string

    @Property()
    type!: 'single_elimination' | 'double_elimination'

    @Property()
    number!: number
}
