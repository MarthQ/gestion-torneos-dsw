import { MikroORM } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { env } from '../../config/env.js'

const isTest = process.env.NODE_ENV === 'test'

export const ORM = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: isTest ? ['dist/**/*.entity.js'] : ['src/**/*.entity.ts'],
    dbName: env.DB_NAME,
    clientUrl: 'mysql://dsw:dsw@localhost:3306/okiDSW',
    highlighter: new SqlHighlighter(),
    debug: true,
    allowGlobalContext: true,
    schemaGenerator: {
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
})

export const syncSchema = async () => {
    const generator = ORM.getSchemaGenerator()

    // await generator.dropSchema()
    // await generator.createSchema()

    await generator.updateSchema()
}