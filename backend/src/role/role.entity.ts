import { Entity, Property, Collection, OneToMany } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { User } from '../user/user.entity.js'

@Entity()
export class Role extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string
    @OneToMany(() => User, (user) => user.role)
    users = new Collection<User>(this)
}
