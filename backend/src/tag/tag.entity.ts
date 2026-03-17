import { Entity, Property, Collection, ManyToMany } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Tournament } from '../tournament/tournament.entity.js'

@Entity()
export class Tag extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string
    @Property({ nullable: false })
    description!: string
    @ManyToMany(() => Tournament, (tournament) => tournament.tags)
    tournaments = new Collection<Tournament>(this)
}
