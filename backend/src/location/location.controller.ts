import { Request, Response } from 'express'
import { Location } from './location.entity.js'
import { ORM } from '../shared/db/orm.js'

const em = ORM.em

async function findAll(req: Request, res: Response) {
    try {
        const Locations = await em.find(Location, {})
        res.status(200).json({
            message: 'Found all locations',
            data: Locations,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const location = await em.findOneOrFail(Location, { id })
        res.status(200).json({ message: 'Found location', data: location })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const location = em.create(Location, req.body)
        await em.flush()
        res.status(201).json({ message: 'Location created', data: location })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const location = em.getReference(Location, id)
        em.assign(location, req.body)
        await em.flush()
        res.status(200).json({ message: 'Location updated' })
    } catch (error: any) {
        res.status(500).json(error.message)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const location = em.getReference(Location, id)
        await em.removeAndFlush(location)
        res.status(200).send({ message: 'Location deleted' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { findAll, findOne, add, update, remove }
