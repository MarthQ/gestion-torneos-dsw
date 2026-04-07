import { Request, Response } from 'express'

import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { hashSync } from 'bcrypt'

import { ORM } from '../shared/db/orm.js'
import { env } from '../config/env.js'
import { User } from './user.entity.js'
import { Mailer } from '../shared/mailer/mailer.service.js'
import { JWTUtils } from '../shared/auth/jwt.utils.js'
import { RequestWithUser } from '../shared/interfaces/requestWithUser.js'
import { UserMapper } from '../shared/mappers/user.mapper.js'
import { handleHttpError } from '../utils/http-errors.utils.js'

const em = ORM.em

const mailer = new Mailer()

const UserSchema = z.object({
    name: z.string({ message: 'Name must be a string' }),
    password: z.string({ message: 'Password must be a string' }).optional(),
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
    } catch (error: any) {
        handleHttpError(error, res)
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
        handleHttpError(error, res)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const user = em.getReference(User, id)
        await em.removeAndFlush(user)
        res.status(200).send({ message: 'User deleted' })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

//TODO (ADMIN) Create user without password
async function add(req: Request, res: Response) {
    try {
        const sanitizedUser = UserSchema.safeParse(req.body)

        if (!sanitizedUser.success) {
            throw fromZodError(sanitizedUser.error)
        }

        const { password, ...userWithoutPassword } = em.create(User, sanitizedUser.data)

        await em.flush()

        res.status(201).json({ message: 'User created', data: userWithoutPassword })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

//(ADMIN) Generate token & send mail
async function sendInvitation(req: Request, res: Response) {
    try {
        const userId = Number.parseInt(req.params.id)

        const frontendUrl = `${env.frontendURL}${req.query['path']}`

        const user = await em.findOneOrFail(User, { id: userId })

        const email = user.mail

        await mailer.sendPasswordAsignation(email, frontendUrl, { userId })

        return res.status(200).json({ message: 'An email has been sent successfully to invite the user' })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

//(USER) Change password
async function changePassword(req: Request, res: Response) {
    try {
        const mailToken = req.params.mailToken

        if (!mailToken) {
            const error = new Error('No token has been supplied')
            ;(error as any).statusCode = 400
            throw error
        }

        const decoded = JWTUtils.verify(mailToken)

        const user = await em.findOneOrFail(User, { id: decoded.userId }, { populate: ['location', 'role'] })

        const password = req.body.password

        const userWithNewPassword = em.assign(user, {
            password: hashSync(password, Number(env.defaultSaltRounds)),
        })

        res.status(200).json({
            message: `Updated user's password successfully`,
            data: {
                user: UserMapper.getUserResponse(userWithNewPassword),
                token: JWTUtils.getJWT({ userId: user.id! }),
            },
        })
    } catch (error: any) {
        handleHttpError(error, res)
    }

    // // Extract email_token
    // // Verify email_token expiraton
    // // Extract userEmail from token
    // // Verify if userEmail belongs to a user
    // // Extract & Hash password from req.body
    // // Update user password
    // // Return status
}
//(USER) Generate token & send mail with link to setup the new password
async function requestResetPassword(req: RequestWithUser, res: Response) {
    //* The user is already authenticated by going through the authenticated middleware

    try {
        const email = String(req.user!.mail!)
        const user = req.user
        const frontendUrl = `${env.frontendURL}${req.query['path']}`

        if (!email) {
            const error = new Error('No email has been supplied')
            ;(error as any).statusCode = 400
            throw error
        }

        const mailerResponse = mailer.sendPasswordReset(email, frontendUrl, { userId: user!.id! })

        res.status(200).json(`A reset password mail has been sent to the user's email`)
    } catch (error: any) {
        handleHttpError(error, res)
    }
}
//(ADMIN) Update user's data
async function update(req: Request, res: Response) {
    try {
        const sanitizedPartialUser = UserSchema.partial().safeParse(req.body)

        if (!sanitizedPartialUser.success) {
            throw fromZodError(sanitizedPartialUser.error)
        }

        const id = Number.parseInt(req.params.id)
        const user = em.getReference(User, id)
        em.assign(user, req.body)
        await em.flush()
        res.status(200).json({ message: 'User updated' })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

export { findAll, findOne, add, update, remove, sendInvitation, changePassword, requestResetPassword }
