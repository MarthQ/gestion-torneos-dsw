import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Location } from '../user/location.entity.js'

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
} 