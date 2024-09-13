import { Request, Response } from 'express'
import { Game } from './game.entity.js'
import { ORM } from '../shared/db/orm.js'

const em = ORM.em

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
        const game = em.create(Game, req.body)
        await em.flush()
        res.status(201).json({ message: 'Game created', data: game })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const game = await em.findOneOrFail(Game, id, { populate: ['tags'] })

        if (game.tags.length === 0) {
            game.tags.removeAll()
        }

        em.assign(game, req.body)
        await em.flush()
        res.status(200).json({ message: 'Game updated' })
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
