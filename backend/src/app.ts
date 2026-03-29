import 'reflect-metadata'
import express from 'express'
import { ORM, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { gameRouter } from './game/game.routes.js'
import { tournamentRouter } from './tournament/tournament.routes.js'
import { userRouter } from './user/user.routes.js'
import { locationRouter } from './location/location.routes.js'
import { inscriptionRouter } from './inscription/inscription.routes.js'
import { roleRouter } from './role/role.routes.js'
import cors from 'cors'
import { matchupRouter } from './matchup/matchup.routes.js'
import { tagRouter } from './tag/tag.routes.js'
import cookieParser from 'cookie-parser'
import { authRouter } from './auth/auth.routes.js'
import { seedRoles, seedLocations } from './db/seeds.js'

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: 'http://localhost:4200',
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
app.use('/api/inscriptions', inscriptionRouter)
app.use('/api/matchups', matchupRouter)
app.use('/api/tags', tagRouter)
app.use('/api/roles', roleRouter)
app.use('/api/auth', authRouter)

app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema() // Never in production
await seedRoles()
await seedLocations()

app.listen(3000, () => {
    console.log('Server running on https://localhost:3000/')
})
