import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Game_Type extends BaseEntity {
    //? Usamos el _id o creamos un atributo id nuevo? -- public _id?: number

    @Property({ nullable: false, unique: true })
    name!: string

    @Property({ nullable: false })
    description!: string

    // TODO: Make the Tags CRUD with an ORM and do a @ManyToMany
    @Property()
    public tags?: string[]
}
