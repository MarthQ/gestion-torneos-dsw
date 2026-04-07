import { Request, Response } from 'express'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { compareSync, hashSync } from 'bcrypt'

import { env } from '../config/env.js'
import { ORM } from '../shared/db/orm.js'
import { User } from '../user/user.entity.js'
import { Role } from '../role/role.entity.js'
import { USER_ROLE } from './interfaces/user-role.const.js'
import { RequestWithUser } from '../shared/interfaces/requestWithUser.js'
import { UserMapper } from '../shared/mappers/user.mapper.js'
import { JWTUtils } from '../shared/auth/jwt.utils.js'
import { Mailer } from '../shared/mailer/mailer.service.js'
import { handleHttpError } from '../utils/http-errors.utils.js'

const em = ORM.em

const mailer = new Mailer()

// Helper function to set JWT cookie
function setJwtCookie(res: Response, token: string) {
    res.cookie(env.jwtCookieName, token, {
        httpOnly: true,
        secure: env.jwtCookieSecure, // Set to 'true' in production (HTTPS), 'false' in development (HTTP)
        sameSite: 'lax',
        maxAge: env.jwtCookieMaxAge,
        path: '/',
    })
}

// Helper function to clear JWT cookie
function clearJwtCookie(res: Response) {
    res.clearCookie(env.jwtCookieName, {
        httpOnly: true,
        secure: env.jwtCookieSecure,
        sameSite: 'lax',
        path: '/',
    })
}

//* VALIDATORS
const loginSchema = z.object({
    mail: z.string({ message: 'Mail must be a string' }).email({ message: 'Mail must be a valid email' }),
    password: z.string({ message: 'Password must be a string.' }),
})

const registerSchema = z.object({
    name: z.string({ message: 'Username must be a string' }),
    password: z.string({ message: 'Password must be a string.' }),
    mail: z.string({ message: 'Mail must be a string' }).email({ message: 'Mail must be a valid email' }),
    location: z.number({ message: 'Location must be valid number.' }),
})

//* PUBLIC METHODS
async function login(req: Request, res: Response) {
    try {
        const sanitizedLogin = loginSchema.safeParse(req.body)
        //* DTO

        if (!sanitizedLogin.success) {
            throw fromZodError(sanitizedLogin.error)
        }

        const { password, mail } = sanitizedLogin.data

        //* Searchs for the user
        const user = await em.findOneOrFail(User, { mail: mail }, { populate: ['role', 'location'] })

        //* if Passwords doesn't match
        if (!compareSync(password, user.password!)) {
            const error = new Error('Credential is not valid (password)')
            ;(error as any).statusCode = 401
            throw error
        }

        // Generate JWT and set as HttpOnly cookie
        const token = JWTUtils.getJWT({ userId: user.id! })
        setJwtCookie(res, token)

        res.status(200).json({
            message: 'User logged successfully',
            data: {
                user: UserMapper.getUserResponse(user),
            },
        })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function register(req: Request, res: Response) {
    try {
        const newUser = req.body

        const sanitizedRegister = registerSchema.safeParse(newUser)

        if (!sanitizedRegister.success) {
            throw fromZodError(sanitizedRegister.error)
        }

        const { password, ...userData } = newUser

        const userRole = await em.findOneOrFail(Role, { name: USER_ROLE.USER })

        const user = em.create(User, {
            ...userData,
            password: hashSync(newUser.password, Number(env.defaultSaltRounds)),
            role: userRole.id,
        })

        await em.persistAndFlush(user)

        // Generate JWT and set as HttpOnly cookie
        const token = JWTUtils.getJWT({ userId: user.id! })
        setJwtCookie(res, token)

        res.status(201).json({
            message: 'User created',
            data: {
                user: UserMapper.getUserResponse(user),
            },
        })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

//TODO (USER) Reset password from "Forgot your password?"
async function forgotPassword(req: Request, res: Response) {
    try {
        const reqUser: User = req.body
        const frontendUrl = env.frontendURL

        if (!reqUser) {
            const error = new Error('No user has been provided')
            ;(error as any).statusCode = 401
            throw error
        }

        const user = await em.findOneOrFail(User, { mail: reqUser.mail }, { populate: ['location', 'role'] })

        mailer.sendPasswordReset(user.mail, `${frontendUrl}/auth/setup-password`, { userId: user.id! })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

//TODO (USER) Setup password
async function setupPassword(req: Request, res: Response) {
    try {
        const mailToken = String(req.query.mailToken)

        if (!mailToken) {
            const error = new Error('No token has been supplied')
            ;(error as any).statusCode = 400
            throw error
        }

        const decoded = JWTUtils.verify(mailToken)

        const user = await em.findOneOrFail(User, { id: decoded.userId }, { populate: ['location', 'role'] })

        const password = req.body.password

        console.log(`La password que estamos cargando es: -${password}-`)

        const userWithNewPassword = em.assign(user, {
            password: hashSync(password, Number(env.defaultSaltRounds)),
        })

        await em.persistAndFlush(userWithNewPassword)

        // Generate JWT and set as HttpOnly cookie
        const token = JWTUtils.getJWT({ userId: user.id! })
        setJwtCookie(res, token)

        res.status(200).json({
            message: `Updated user's password successfully`,
            data: {
                user: UserMapper.getUserResponse(userWithNewPassword),
            },
        })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function checkAuthStatus(req: RequestWithUser, res: Response) {
    const user = req.user!

    return res.status(201).json({
        message: 'User authenticated',
        data: {
            user: UserMapper.getUserResponse(user),
        },
    })
}

async function logout(req: Request, res: Response) {
    clearJwtCookie(res)

    res.status(200).json({
        message: 'Logged out successfully',
    })
}

export { register, login, checkAuthStatus, forgotPassword, setupPassword, logout }
