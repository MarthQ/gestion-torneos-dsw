import { Entity, ManyToOne, PrimaryKey, Property, Rel, Collection, OneToMany } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Location } from '../location/location.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'
import { Role } from '../role/role.entity.js'
import { Tournament } from '../tournament/tournament.entity.js'

@Entity()
export class User extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string
    @Property()
    password!: string
    @Property()
    mail!: string
    @ManyToOne(() => Location, { nullable: false })
    location!: Rel<Location>
    @ManyToOne(() => Role, { nullable: false })
    role!: Rel<Location>
    @OneToMany(() => Inscription, (inscription) => inscription.user)
    inscriptions = new Collection<Inscription>(this)

    // Torneos que el usuario creo
    @OneToMany(() => Tournament, (Tournament) => Tournament.creator)
    tournament = new Collection<Tournament>(this)
}
