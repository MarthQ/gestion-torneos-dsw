import { Entity, Property, Cascade, Collection, OneToMany } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Tournament } from '../tournament/tournament.entity.js'

@Entity()
export class Region extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string
    @OneToMany(() => Tournament, (tournament) => tournament.region, { cascade: [Cascade.ALL] })
    tournament = new Collection<Tournament>(this)
}
