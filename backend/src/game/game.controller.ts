import { Request, Response } from 'express'
import { Game } from './game.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { env } from '../config/env.js'
import { GameMapper } from '../shared/mappers/gameMapper.js'
import { GameDTO, IGDBGame } from '../shared/interfaces/game.js'

const em = ORM.em

const GameSchema = z.object({
    name: z.string({ message: 'Name must be a string' }),
    description: z.string({ message: 'Description must be a string' }),
    imgId: z.string({ message: 'Img Id must be a string' }),
    igdbId: z.number({ message: 'Description must be a number referencing IGDB DB' }),
    gametype: z.number({ message: 'Gametype must be a number representing a Gametype id' }),
})

async function searchIGDB(req: Request, res: Response) {
    const query = req.query.query ? String(req.query.query) : undefined

    if (!query) {
        const error = new Error('Query is required')
        ;(error as any).statusCode = 400
        throw error
    }

    const response = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            'Client-ID': env.igdbClientId,
            Authorization: `Bearer ${env.igdbAccessToken}`,
            'Content-Type': 'text/plain',
        },
        body: `search "${query}"; fields name,cover.url,summary,rating; where game_type = (0,2,4,5,8,9,10,11,12); limit 10;`,
    })

    if (!response.ok) {
        const error = new Error('IGDB API error')
        ;(error as any).statusCode = 502
        throw error
    }

    const igdbGames: IGDBGame[] = await response.json()
    const data = GameMapper.mapIgdbGameArrayToGameArray(igdbGames)
    res.status(200).json({ message: 'Found IGDB games', data })
}

//TODO: Discuss whether findAll should have or no pagination.
async function findAll(req: Request, res: Response) {
    // const page = req.query.page ? Number(req.query.page) : 1
    // const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
    // const offset = (page - 1) * pageSize

    // const query = req.query.query ? String(req.query.query) : undefined

    // const filter: any = {}

    // if (query) filter.name = { $like: `%${query}%` }

    // const [games, total] = await em.findAndCount(Game, filter, {
    //     limit: pageSize,
    //     offset,
    // })

    const games = await em.findAll(Game)
    res.status(200).json({
        message: 'Found all games',
        data: games,
        // meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    })
}

async function findOne(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id)
    const game = await em.findOneOrFail(Game, { id })
    res.status(200).json({ message: 'Found game', data: game })
}

async function add(req: Request, res: Response) {
    const igdbId = req.body.igdbId ? Number(req.body.igdbId) : null

    // Checkear usando el findOne que el juego no existe ya en la DB.

    if (!igdbId) {
        const error = new Error('An IGDB ID is required')
        ;(error as any).statusCode = 400
        throw error
    }

    const existingGame = await em.findOne(Game, { igdbId })
    if (existingGame) {
        const error = new Error('Game already is registered in the database.')
        ;(error as any).statusCode = 409
        throw error
    }

    const response = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            'Client-ID': env.igdbClientId,
            Authorization: `Bearer ${env.igdbAccessToken}`,
            'Content-Type': 'text/plain',
        },
        body: `fields name,cover.image_id,summary,rating; where id = ${igdbId};`,
    })

    if (!response.ok) {
        const error = new Error('IGDB API error')
        ;(error as any).statusCode = 502
        throw error
    }

    const igdbResponse: IGDBGame[] = await response.json()
    const igdbGame: IGDBGame = igdbResponse[0]
    const { tournament, ...newGame } = GameMapper.mapIgdbGameItemToGame(igdbGame)
    const game = em.create(Game, newGame)

    await em.flush()
    res.status(201).json({ message: 'Game added to database', data: game })
}

async function update(req: Request, res: Response) {
    const sanitizedGame = GameSchema.partial().safeParse(req.body)
    if (!sanitizedGame.success) {
        throw fromZodError(sanitizedGame.error)
    } else {
        const id = Number.parseInt(req.params.id)
        const game = await em.findOneOrFail(Game, id)

        em.assign(game, sanitizedGame.data)
        await em.flush()
        res.status(200).json({ message: 'Game updated' })
    }
}

async function remove(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id)
    const game = em.getReference(Game, id)
    await em.removeAndFlush(game)
    res.status(200).send({ message: 'Game deleted' })
}

export { findAll, searchIGDB, findOne, add, update, remove }
