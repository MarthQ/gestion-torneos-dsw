import 'reflect-metadata'
import express from 'express'
import { gameTypeRouter } from './game_type/game_type.routes.js'
import { ORM, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { tagRouter } from './tag/tag.routes.js'

const app = express()
app.use(express.json())

// After base middlewares like express
app.use((req, res, next) => {
    RequestContext.create(ORM.em, next)
})
// Before routes and business middlewares

app.use('/api/game-types', gameTypeRouter)
app.use('/api/tags', tagRouter)

app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema() // Never in production

app.listen(3000, () => {
    console.log('Server running on https://localhost:3000/')
})
