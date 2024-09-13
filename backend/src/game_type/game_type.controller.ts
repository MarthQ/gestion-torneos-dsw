import { Request, Response, NextFunction } from 'express'
import { Game_Type } from './game_type.entity.js'
import { ORM } from '../shared/db/orm.js'

const em = ORM.em

async function findAll(req: Request, res: Response) {
    try {
        const gameTypes = await em.find(Game_Type, {}, { populate: ['tags'] })
        res.status(200).json({
            message: 'Found all game types',
            data: gameTypes,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const gameType = await em.findOneOrFail(Game_Type, { id }, { populate: ['tags'] })
        res.status(200).json({ message: 'Found the game type', data: gameType })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const gameType = em.create(Game_Type, req.body)
        await em.flush()
        res.status(201).json({
            message: 'Successfully created a new game type',
            data: gameType,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const gameType = await em.findOneOrFail(Game_Type, id, { populate: ['tags'] })

        if (req.body.tags.length === 0) {
            gameType.tags.removeAll()
        }
        em.assign(gameType, req.body)
        await em.flush()
        res.status(200).json({ message: 'Successfully updated the game type' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const gameTypeReference = em.getReference(Game_Type, id)
        await em.removeAndFlush(gameTypeReference)
        res.status(200).send({ message: 'Successfully deleted the game type' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { findAll, findOne, add, update, remove }
