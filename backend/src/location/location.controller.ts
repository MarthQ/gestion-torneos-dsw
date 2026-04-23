import { Request, Response } from 'express'
import { Location } from './location.entity.js'
import { ORM } from '../shared/db/orm.js'
import { fromZodError } from 'zod-validation-error'
import { LocationSchema } from './location.schema.js'

const em = ORM.em

async function findAll(req: Request, res: Response) {
    try {
        const page = req.query.page ? Number(req.query.page) : undefined
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined

        const query = req.query.query ? String(req.query.query) : undefined

        const filter = query ? { name: { $like: `%${query}%` } } : {}

        // If page and pageSize come in query, return paginated results.
        if (page && pageSize) {
            const [locations, total] = await em.findAndCount(Location, filter, {
                limit: pageSize,
                offset: (page - 1) * pageSize,
            })
            return res.status(200).json({
                message: 'Found paginated locations',
                data: locations,
                meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
            })
        }
        const locations = await em.find(Location, filter)
        res.status(200).json({
            message: 'Found all locations',
            data: locations,
        })
    } catch (error: any) {
        res.status(404).json({ message: error.message })
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
