import { Request, Response } from 'express'
import { fromZodError } from 'zod-validation-error'
import { hashSync } from 'bcrypt'

import { ORM } from '../shared/db/orm.js'
import { env } from '../config/env.js'
import { User } from './user.entity.js'
import { Mailer } from '../shared/mailer/mailer.service.js'
import { JWTUtils } from '../shared/auth/jwt.utils.js'
import { RequestWithUser } from '../shared/interfaces/requestWithUser.js'
import { UserMapper } from '../shared/mappers/user.mapper.js'
import { UserSchema } from './user.schema.js'

const em = ORM.em

const mailer = new Mailer()

async function findAll(req: Request, res: Response) {
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

    const requestUsers = users.map((user) => {
        const { password, ...rest } = user
        return {
            ...rest,
            hasPassword: !!user.password,
        }
    })

    res.status(200).json({
        message: 'Found all locations',
        data: requestUsers,
        meta: {
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        },
    })
}

async function findOne(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id)
    const user = await em.findOneOrFail(
        User,
        { id },
        { populate: ['location', 'inscriptions', 'role', 'tournament'] },
    )
    const { password, ...userData } = user
    res.status(200).json({ message: 'Found user', data: userData })
}

async function remove(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id)
    const user = em.getReference(User, id)
    await em.removeAndFlush(user)
    res.status(200).send({ message: 'User deleted' })
}

//TODO (ADMIN) Create user without password
async function add(req: Request, res: Response) {
    const sanitizedUser = UserSchema.safeParse(req.body)

    if (!sanitizedUser.success) {
        throw fromZodError(sanitizedUser.error)
    }

    const { password, ...userWithoutPassword } = em.create(User, sanitizedUser.data)

    await em.flush()

    res.status(201).json({ message: 'User created', data: userWithoutPassword })
}

//(ADMIN) Generate token & send mail
async function sendInvitation(req: Request, res: Response) {
    const userId = Number.parseInt(req.params.id)

    const path = String(req.query['path'] || '')

    if (!path) {
        const error = new Error('Path query parameter is required')
        ;(error as any).statusCode = 400
        throw error
    }

    const frontendUrl = `${env.frontendURL}${req.query['path']}`

    const user = await em.findOne(User, { id: userId })

    if (!user) {
        const error = new Error('Credential is not valid')
        ;(error as any).statusCode = 401
        throw error
    }

    const email = user.mail

    await mailer.sendPasswordAsignation(email, frontendUrl, { userId })

    return res.status(200).json({ message: 'An email has been sent successfully to invite the user' })
}

//(ADMIN) Update user's data
async function update(req: Request, res: Response) {
    const sanitizedPartialUser = UserSchema.partial().safeParse(req.body)

    if (!sanitizedPartialUser.success) {
        throw fromZodError(sanitizedPartialUser.error)
    }

    const id = Number.parseInt(req.params.id)
    const user = em.getReference(User, id)
    em.assign(user, req.body)
    await em.flush()
    res.status(200).json({ message: 'User updated' })
}

async function updateByUser(req: RequestWithUser, res: Response) {
    const sanitizedPartialUser = UserSchema.partial().safeParse(req.body)

    if (!sanitizedPartialUser.success) {
        throw fromZodError(sanitizedPartialUser.error)
    }

    const user = req.user

    if (user!.nameChangedOn) {
        if (user!.name != sanitizedPartialUser.data.name) {
            const userCopied = await em.findOne(User, { name: sanitizedPartialUser.data.name })

            if (userCopied) {
                const error = new Error('Username already exist.')
                ;(error as any).statusCode = 409
                throw error
            }
        }
        const fechaLimite = new Date(user!.nameChangedOn!)
        fechaLimite.setMonth(fechaLimite.getMonth() + 3)
        if (new Date() < fechaLimite) {
            const error = new Error('Cooldown is not over for the name change.')
            ;(error as any).statusCode = 403
            throw error
        }
    }

    em.assign(user!, sanitizedPartialUser.data)
    await em.flush()
    res.status(200).json({ message: 'Perfil actualizado' })
}

export { findAll, findOne, add, update, updateByUser, remove, sendInvitation }
