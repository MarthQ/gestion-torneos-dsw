import { Entity,PrimaryKey, Property, ManyToOne, ManyToMany, DateTimeType } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Game}  from '../game/game.entity.js'
import { Tag } from '../tag/tag.entity.js'

@Entity()
export class Tournament extends BaseEntity {
    @PrimaryKey()
    id?: number
    @Property({nullable: false, unique:true})
    name!: string
    @Property()
    desc!: string
    @Property()
    datetimeinit!: DateTimeType
    @Property()
    cant_personas!: number
    @Property()
    status!: string
    @ManyToOne(() => Game, {nullable: false})
    game!: Game
    @ManyToMany(() => Tag, (tag) => tag.tournaments, { owner: true })
    tags!: Tag[]
    
    //Falta la relacion con usuario (Inscripcion)
    //Hay que hacer otra entidad para poder ponerle atributos?
} 