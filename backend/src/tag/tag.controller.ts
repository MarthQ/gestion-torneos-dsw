import { Request, Response } from 'express'
import { Tag } from './tag.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

const em = ORM.em

const TagSchema = z.object({
    id: z.number().gt(0).optional(),
    name: z.string({ message: 'Name must be a string' }),
    description: z.string({ message: 'Description must be a string' }),
})

async function findAll(req: Request, res: Response) {
    try {
        const tags = await em.find(Tag, {})
        res.status(200).json({
            message: 'Found all tags',
            data: tags,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tags = await em.findOneOrFail(Tag, { id })
        res.status(200).json({ message: 'Found the tag', data: tags })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const sanitizedTag = TagSchema.safeParse(req.body)

        if (!sanitizedTag.success) {
            throw fromZodError(sanitizedTag.error)
        } else {
            const tag = em.create(Tag, sanitizedTag.data)
            await em.flush()
            res.status(201).json({
                message: 'Successfully created a new tag',
                data: tag,
            })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function update(req: Request, res: Response) {
    try {
        const sanitizedTag = TagSchema.partial().safeParse(req.body)

        if (!sanitizedTag.success) {
            throw fromZodError(sanitizedTag.error)
        } else {
            const id = Number.parseInt(req.params.id)
            const tagReference = em.getReference(Tag, id)
            em.assign(tagReference, sanitizedTag.data)
            await em.flush()
            res.status(200).json({ message: 'Successfully updated the tag' })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tagReference = em.getReference(Tag, id)
        await em.removeAndFlush(tagReference)
        res.status(200).send({ message: 'Successfully deleted the tag' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { findAll, findOne, add, update, remove }
