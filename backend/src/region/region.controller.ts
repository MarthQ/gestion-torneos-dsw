import { Request, Response } from 'express'
import { Region } from './region.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { handleHttpError } from '../utils/http-errors.utils.js'

const em = ORM.em

const RegionSchema = z.object({
    name: z.string({ message: 'Name must be a string' }),
})

async function findAll(req: Request, res: Response) {
    try {
        const page = req.query.page ? Number(req.query.page) : undefined
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined

        const query = req.query.query ? String(req.query.query) : undefined

        const filter = query ? { name: { $like: `%${query}%` } } : {}

        // If page and pageSize come in query, return paginated results.
        if (page && pageSize) {
            const [regions, total] = await em.findAndCount(Region, filter, {
                limit: pageSize,
                offset: (page - 1) * pageSize,
            })
            return res.status(200).json({
                message: 'Found paginated regions',
                data: regions,
                meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
            })
        }
        const regions = await em.find(Region, filter)
        res.status(200).json({
            message: 'Found all regions',
            data: regions,
        })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const region = await em.findOneOrFail(Region, { id })
        res.status(200).json({ message: 'Found Region', data: region })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function add(req: Request, res: Response) {
    try {
        const sanitizedRegion = RegionSchema.safeParse(req.body)

        if (!sanitizedRegion.success) {
            throw fromZodError(sanitizedRegion.error)
        }

        const region = em.create(Region, sanitizedRegion.data)
        await em.flush()
        res.status(201).json({ message: 'Region created', data: region })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}
async function update(req: Request, res: Response) {
    try {
        const sanitizedRegion = RegionSchema.partial().safeParse(req.body)

        if (!sanitizedRegion.success) {
            throw fromZodError(sanitizedRegion.error)
        } else {
            const id = Number.parseInt(req.params.id)
            const region = em.getReference(Region, id)
            em.assign(region, sanitizedRegion.data)
            await em.flush()
        }
        res.status(200).json({ message: 'Region updated' })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const region = em.getReference(Region, id)
        await em.removeAndFlush(region)
        res.status(200).send({ message: 'Region deleted' })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

export { findAll, findOne, add, update, remove }
