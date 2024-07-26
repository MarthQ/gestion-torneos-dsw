import {
    Collection,
    Entity,
    ManyToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Game_Type } from '../game_type/game_type.entity.js'

@Entity()
export class Tag extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string

    @Property()
    description!: string

    @ManyToMany(() => Game_Type, (game_type) => game_type.tags)
    game_types = new Collection<Game_Type>(this)
}
