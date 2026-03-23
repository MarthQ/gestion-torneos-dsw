import { PrimaryKey } from '@mikro-orm/core'

export abstract class BaseEntity {
    @PrimaryKey()
    id?: number

    /* 
  @Property {(type: DateTimeType)}
  createdAt? = new Date()

  Property({
  type: DateTimeType,
  enUpdate: () => new Date(),
  })
  updateAt? = new Date()
  */
}
