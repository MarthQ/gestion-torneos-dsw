import { Request, Response } from 'express'
import { Location } from './location.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

const em = ORM.em

const LocationSchema = z.object({
    id: z.number().gt(0).optional(),
    name: z.string({ message: 'Name must be a string' }),
})

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
        const sanitizedLocation = LocationSchema.safeParse(req.body)

        if (!sanitizedLocation.success) {
            throw fromZodError(sanitizedLocation.error)
        } else {
            const location = em.create(Location, sanitizedLocation.data)
            await em.flush()
            res.status(201).json({ message: 'Location created', data: location })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const sanitizedLocation = LocationSchema.partial().safeParse(req.body)

        if (!sanitizedLocation.success) {
            throw fromZodError(sanitizedLocation.error)
        } else {
            const id = Number.parseInt(req.params.id)
            const location = em.getReference(Location, id)
            em.assign(location, sanitizedLocation.data)
            await em.flush()
        }
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
