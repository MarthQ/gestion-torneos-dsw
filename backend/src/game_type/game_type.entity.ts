import { Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Tag } from '../tag/tag.entity.js'

@Entity()
export class Game_Type extends BaseEntity {
    //? Usamos el _id o creamos un atributo id nuevo? -- public _id?: number

    @Property({ nullable: false, unique: true })
    name!: string

    @Property({ nullable: false })
    description!: string

    @ManyToMany(() => Tag, (tag) => tag.game_types, { owner: true })
    tags!: Tag[]
}
