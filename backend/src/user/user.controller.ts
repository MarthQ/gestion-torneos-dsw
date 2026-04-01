import { Request, Response } from 'express'
import { User } from './user.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { hashSync } from 'bcrypt'
import { env } from '../config/env.js'

const em = ORM.em

const UserSchema = z.object({
    id: z.number().gt(0).optional(),
    name: z.string({ message: 'Name must be a string' }),
    password: z.string({ message: 'Password must be a string' }),
    mail: z.string({ message: 'Mail must be a string' }),
    location: z.number({
        message: 'Location must be a number representing a location id',
    }),
    role: z.number({ message: 'Role must be a number representing a role id' }),
})

async function findAll(req: Request, res: Response) {
    try {
        const page = req.query.page ? Number(req.query.page) : 1
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
        const offset = (page - 1) * pageSize

        const query = req.query.query ? String(req.query.query) : undefined
        const role = req.query.role ? Number(req.query.role) : undefined
        const location = req.query.location ? Number(req.query.location) : undefined

        const filter: any = {}

        if (query) filter.name = { $like: `%${query}%` }
        if (role) filter.role = role
        if (location) filter.location = location

        const [users, total] = await em.findAndCount(User, filter, {
            limit: pageSize,
            offset,
            populate: ['location', 'role'],
        })
        res.status(200).json({
            message: 'Found all locations',
            data: users,
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        })
    } catch (error: any) {
        res.status(404).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const user = await em.findOneOrFail(
            User,
            { id },
            { populate: ['location', 'inscriptions', 'role', 'tournament'] },
        )
        const { password, ...userData } = user
        res.status(200).json({ message: 'Found user', data: userData })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const sanitizedUser = UserSchema.safeParse(req.body)

        if (!sanitizedUser.success) {
            throw fromZodError(sanitizedUser.error)
        }
        sanitizedUser.data.password = hashSync(sanitizedUser.data.password!, Number(env.defaultSaltRounds))
        const { password, ...userWithoutPassword } = em.create(User, sanitizedUser.data)
        await em.flush()
        res.status(201).json({ message: 'User created', data: userWithoutPassword })
    } catch (error: any) {
        // MikroORM Errors
        if (error.sqlMessage.includes('user_name_unique')) {
            return res.status(409).json({
                message: `Name already taken`,
            })
        }
        if (error.sqlMessage.includes('user_mail_unique')) {
            return res.status(409).json({
                message: `Email already taken`,
            })
        }
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const sanitizedPartialUser = UserSchema.partial().safeParse(req.body)
        if (!sanitizedPartialUser.success) {
            throw fromZodError(sanitizedPartialUser.error)
        } else {
            const id = Number.parseInt(req.params.id)
            req.body.password = hashSync(req.body.password, Number(env.defaultSaltRounds))
            const user = em.getReference(User, id)
            em.assign(user, req.body)
            await em.flush()
            res.status(200).json({ message: 'User updated' })
        }
    } catch (error: any) {
        console.log({ error })

        // MikroORM Errors
        if (error.sqlMessage.includes('user_name_unique')) {
            return res.status(409).json({
                message: `Name already taken`,
            })
        }
        if (error.sqlMessage.includes('user_mail_unique')) {
            return res.status(409).json({
                message: `Email already taken`,
            })
        }
        res.status(500).json(error.message)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const user = em.getReference(User, id)
        await em.removeAndFlush(user)
        res.status(200).send({ message: 'User deleted' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { findAll, findOne, add, update, remove }
