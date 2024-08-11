import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    ManyToMany,
    Rel,
    Collection
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Game } from '../game/game.entity.js'
import { Tag } from '../tag/tag.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'

@Entity()
export class Tournament extends BaseEntity {
    @PrimaryKey()
    id?: number
    @Property({ nullable: false, unique: true })
    name!: string
    @Property()
    desc!: string
    @Property()
    datetimeinit!: Date
    @Property()
    cant_personas!: number
    @Property()
    status!: string
    @ManyToOne(() => Game, { nullable: false })
    game!: Rel<Game>
    @ManyToMany(() => Tag, (tag) => tag.tournaments, { owner: true })
    tags!: Tag[]
    @ManyToMany(() => Inscription, (inscription) => inscription.tournament)
    inscriptions = new Collection<Inscription>(this)
    //Falta la relacion con usuario (Inscripcion)
    //Hay que hacer otra entidad para poder ponerle atributos?
}
