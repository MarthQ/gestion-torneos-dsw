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
    id: z.number().gt(0).optional(),
    name: z.string({ message: 'Name must be a string' }),
    description: z.string({ message: 'Description must be a string' }),
    imgId: z.string({ message: 'Description must be a string' }).optional(),
    igdbId: z.number({ message: 'Description must be a number referencing IGDB DB' }),
    gametype: z.number({ message: 'Gametype must be a number representing a Gametype id' }),
})

async function searchIGDB(req: Request, res: Response) {
    try {
        const query = req.query.query ? String(req.query.query) : undefined

        if (!query) {
            return res.status(400).json({ message: 'Query is required' })
        }

        const response = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
                'Client-ID': env.igdbClientId,
                Authorization: `Bearer ${env.igdbAccessToken}`,
                'Content-Type': 'text/plain',
            },
            body: `search "${query}"; fields name,cover.image_id,summary,rating; limit 10;`,
        })

        if (!response.ok) {
            return res.status(502).json({ message: 'IGDB API error' })
        }

        const igdbGames: IGDBGame[] = await response.json()
        const data = GameMapper.mapIgdbGameArrayToGameArray(igdbGames)
        res.status(200).json({ message: 'Found IGDB games', data })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

//TODO: Discuss whether findAll should have or no pagination.
async function findAll(req: Request, res: Response) {
    try {
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
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const game = await em.findOneOrFail(Game, { id })
        res.status(200).json({ message: 'Found game', data: game })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const igdbId = req.body.igdbId ? Number(req.body.igdbId) : null

        // Checkear usando el findOne que el juego no existe ya en la DB.

        if (!igdbId) {
            return res.status(400).json({ message: 'An IGDB ID is required' })
        }

        const existingGame = await em.findOne(Game, { igdbId })
        if (existingGame) {
            return res.status(409).json({ message: 'Game already is registered in the database.' })
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
            return res.status(502).json({ message: 'IGDB API error' })
        }

        const igdbResponse: IGDBGame[] = await response.json()
        const igdbGame: IGDBGame = igdbResponse[0]
        console.log('igdbGame:', igdbGame)
        const { tournament, ...newGame } = GameMapper.mapIgdbGameItemToGame(igdbGame)
        console.log('newGame:', newGame)
        const game = em.create(Game, newGame)

        await em.flush()
        res.status(201).json({ message: 'Game added to database', data: game })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error })
    }
}

async function update(req: Request, res: Response) {
    try {
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
    } catch (error: any) {
        res.status(500).json(error.message)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const game = em.getReference(Game, id)
        await em.removeAndFlush(game)
        res.status(200).send({ message: 'Game deleted' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { findAll, searchIGDB, findOne, add, update, remove }
