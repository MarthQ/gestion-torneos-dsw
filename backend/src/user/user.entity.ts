import { Entity, ManyToOne, PrimaryKey, Property, Rel, ManyToMany, Collection } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Location } from '../user/location.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'

@Entity()
export class User extends BaseEntity {
    @PrimaryKey()
    id?: number
    @Property({nullable: false, unique:true})
    name!: string
    @Property()
    password!: string
    @Property()
    mail!: string
    @ManyToOne(() => Location, {nullable: false})
    location!: Location
    @ManyToMany(() => Inscription, (inscription) => inscription.user)
    inscriptions = new Collection<Inscription>(this)
} 