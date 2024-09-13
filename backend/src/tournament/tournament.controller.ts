import { Request, Response } from 'express'
import { Tournament } from './tournament.entity.js'
import { ORM } from '../shared/db/orm.js'

const em = ORM.em

async function findAll(req: Request, res: Response) {
    try {
        const Tournaments = await em.find(Tournament, {}, { populate: ['tags', 'game'] })
        res.status(200).json({
            message: 'Found all tournaments',
            data: Tournaments,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tournament = await em.findOneOrFail(Tournament, { id }, { populate: ['tags', 'game'] })
        res.status(200).json({ message: 'Found tournament', data: tournament })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const tournament = em.create(Tournament, req.body)
        await em.flush()
        res.status(201).json({ message: 'Tournament created', data: tournament })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tournament = await em.findOneOrFail(Tournament, id, { populate: ['tags'] })

        if (req.body.tags.length === 0) {
            tournament.tags.removeAll()
        }

        em.assign(tournament, req.body)
        await em.flush()
        res.status(200).json({ message: 'Tournament updated' })
    } catch (error: any) {
        res.status(500).json(error.message)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tournament = em.getReference(Tournament, id)
        await em.removeAndFlush(tournament)
        res.status(200).send({ message: 'Tournament deleted' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { findAll, findOne, add, update, remove }
