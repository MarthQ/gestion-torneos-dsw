import express from 'express'
import { gameTypeRouter } from './game_type/game_type.routes.js'
import { gameTagRouter } from './game_tag/game_tag.routes.js'

const app = express()
app.use(express.json())

app.use('/api/game-types', gameTypeRouter)

app.use('/api/game-tags', gameTagRouter)

app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
})

app.listen(3000, () => {
    console.log('Server running on https://localhost:3000/')
})
