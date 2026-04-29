import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import { ORM, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { gameRouter } from './game/game.routes.js'
import { tournamentRouter } from './tournament/tournament.routes.js'
import { userRouter } from './user/user.routes.js'
import { locationRouter } from './location/location.routes.js'
import { inscriptionRouter } from './inscription/inscription.routes.js'
import { roleRouter } from './role/role.routes.js'
import cors from 'cors'
import { tagRouter } from './tag/tag.routes.js'
import cookieParser from 'cookie-parser'
import { authRouter } from './auth/auth.routes.js'
import { regionRouter } from './region/region.routes.js'
import { seedRoles, seedLocations, seedTags, seedRegions } from './db/seeds.js'
import { env } from './config/env.js'
import { handleHttpError } from './utils/http-errors.utils.js'

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: env.frontendURL,
        credentials: true,
    }),
)

app.use(cookieParser())

// After base middlewares like express
app.use((req, res, next) => {
    RequestContext.create(ORM.em, next)
})
// Before routes and business middlewares

app.use('/api/games', gameRouter)
app.use('/api/tournaments', tournamentRouter)
app.use('/api/users', userRouter)
app.use('/api/locations', locationRouter)
app.use('/api/regions', regionRouter)
app.use('/api/inscriptions', inscriptionRouter)
app.use('/api/tags', tagRouter)
app.use('/api/roles', roleRouter)
app.use('/api/auth', authRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Catched an error:', err)
    handleHttpError(err, res)
})

app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema() // Never in production
await seedRoles()
await seedLocations()
await seedTags()
await seedRegions()

app.listen(3000, () => {
    console.log('Server running on https://localhost:3000/')
})
