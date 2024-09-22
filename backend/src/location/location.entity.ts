import { Entity, PrimaryKey, Property, Cascade, Collection, OneToMany } from '@mikro-orm/core'
import { User } from '../user/user.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Location extends BaseEntity {
    @Property({ nullable: false })
    name!: string
    @OneToMany(() => User, (user) => user.location, { cascade: [Cascade.ALL] })
    user = new Collection<User>(this)
}
