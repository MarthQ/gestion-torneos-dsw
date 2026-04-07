import { Request, Response } from 'express'
import { Role } from './role.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { handleHttpError } from '../utils/http-errors.utils.js'

const em = ORM.em

const RoleSchema = z.object({
    name: z.string({ message: 'Name must be a string' }),
})

async function findAll(req: Request, res: Response) {
    try {
        const page = req.query.page ? Number(req.query.page) : 1
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
        const offset = (page - 1) * pageSize

        const query = req.query.query ? String(req.query.query) : undefined

        // Filter to check if the query string is in the name
        const filter = query ? { name: { $like: `%${query}%` } } : {}

        const [roles, total] = await em.findAndCount(Role, filter, {
            limit: pageSize,
            offset,
            orderBy: { id: 'asc' },
        })

        res.status(200).json({
            message: 'Found selected roles',
            data: roles,
            meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
        })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const role = await em.findOneOrFail(Role, { id })
        res.status(200).json({ message: 'Found role', data: role })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function add(req: Request, res: Response) {
    try {
        const sanitizedRole = RoleSchema.safeParse(req.body)

        if (!sanitizedRole.success) {
            throw fromZodError(sanitizedRole.error)
        } else {
            const role = em.create(Role, sanitizedRole.data)
            await em.flush()
            res.status(201).json({ message: 'Role created', data: role })
        }
    } catch (error: any) {
        handleHttpError(error, res)
    }
}
async function update(req: Request, res: Response) {
    try {
        const sanitizedPartialRole = RoleSchema.partial().safeParse(req.body)

        if (!sanitizedPartialRole.success) {
        } else {
            const id = Number.parseInt(req.params.id)
            const role = em.getReference(Role, id)
            em.assign(role, sanitizedPartialRole.data)
            await em.flush()
            res.status(200).json({ message: 'Role updated' })
        }
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const role = em.getReference(Role, id)
        await em.removeAndFlush(role)
        res.status(200).send({ message: 'Role deleted' })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

export { findAll, findOne, add, update, remove }
