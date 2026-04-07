import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class BracketStage extends BaseEntity {
    @Property()
    tournament_id!: number

    @Property()
    name!: string

    @Property()
    type!: 'single_elimination' | 'double_elimination'

    @Property()
    number!: number

    // bracket-stage.entity.ts
    @Property({ type: 'json' })
    settings!: {
        seedOrdering?: string[]
        doubleElimination?: {
            grandFinal?: string
        }
    }
}
