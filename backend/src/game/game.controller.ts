import { Request, Response } from 'express'
import { Game } from './game.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

const em = ORM.em

const GameSchema = z.object({
    id: z.number().gt(0).optional(),
    name: z.string({ message: 'Name must be a string' }),
    gametype: z.number({ message: 'Gametype must be a number representing a Gametype id' }),
    tags: z.array(z.number()).optional(),
})

async function findAll(req: Request, res: Response) {
    try {
        const Games = await em.find(Game, {}, { populate: ['tags', 'gametype'] })
        res.status(200).json({
            message: 'Found all games',
            data: Games,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const game = await em.findOneOrFail(Game, { id }, { populate: ['tags', 'gametype'] })
        res.status(200).json({ message: 'Found game', data: game })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const sanitizedGame = GameSchema.safeParse(req.body)

        if (!sanitizedGame.success) {
            throw fromZodError(sanitizedGame.error)
        } else {
            const game = em.create(Game, sanitizedGame.data)
            await em.flush()
            res.status(201).json({ message: 'Game created', data: game })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const sanitizedGame = GameSchema.partial().safeParse(req.body)
        if (!sanitizedGame.success) {
            throw fromZodError(sanitizedGame.error)
        } else {
            const id = Number.parseInt(req.params.id)
            const game = await em.findOneOrFail(Game, id, { populate: ['tags'] })

            if (sanitizedGame.data.tags?.length === 0) {
                game.tags.removeAll()
            }

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

export { findAll, findOne, add, update, remove }
