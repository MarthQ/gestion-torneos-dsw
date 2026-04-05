import { Request, Response } from 'express'
import { Tag } from './tag.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'

const em = ORM.em

const TagSchema = z.object({
    name: z.string({ message: 'Name must be a string' }),
    description: z.string({ message: 'Description must be a string' }),
})

async function findAll(req: Request, res: Response) {
    try {
        const page = req.query.page ? Number(req.query.page) : undefined
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined

        const query = req.query.query ? String(req.query.query) : undefined

        // Filter to check if the query string is in the name or in the description
        const filter = query
            ? { $or: [{ name: { $like: `%${query}%` } }, { description: { $like: `%${query}%` } }] }
            : {}

        if (page && pageSize) {
            const [tags, total] = await em.findAndCount(Tag, filter, {
                limit: pageSize,
                offset: (page - 1) * pageSize,
            })
            return res.status(200).json({
                message: 'Found paginated tags',
                data: tags,
                meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
            })
        }
        const tags = await em.find(Tag, filter)
        res.status(200).json({
            message: 'Found all tags',
            data: tags,
        })
    } catch (error: any) {
        res.status(404).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tags = await em.findOneOrFail(Tag, { id })
        res.status(200).json({ message: 'Found tag', data: tags })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const tags = em.create(Tag, req.body)
        await em.flush()
        res.status(201).json({ message: 'Tag created', data: tags })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tags = em.getReference(Tag, id)
        em.assign(tags, req.body)
        await em.flush()
        res.status(200).json({ message: 'Tag updated' })
    } catch (error: any) {
        res.status(500).json(error.message)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tags = em.getReference(Tag, id)
        await em.removeAndFlush(tags)
        res.status(200).send({ message: 'Tag deleted' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { findAll, findOne, add, update, remove }
