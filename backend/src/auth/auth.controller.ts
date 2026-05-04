import { Request, Response } from 'express'
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
import { loginSchema, registerSchema, forgotPasswordSchema, setupPasswordSchema, setupPasswordQuerySchema } from './auth.schema.js';

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

//* PUBLIC METHODS
async function login(req: Request, res: Response) {
    const sanitizedLogin = loginSchema.safeParse(req.body)
    //* DTO
    if (!sanitizedLogin.success) {
        const error = fromZodError(sanitizedLogin.error)
        ;(error as any).details = sanitizedLogin.error.issues 
        throw error
    }

    const { password, mail } = sanitizedLogin.data

    //* Searchs for the user
    const user = await em.findOne(User, { mail: mail }, { populate: ['role', 'location'] })

    if (!user) {
        const error = new Error('Credential is not valid')
        ;(error as any).statusCode = 401
        throw error
    }

    //* if Passwords doesn't match
    if (!compareSync(password, user.password!)) {
        const error = new Error('Credential is not valid')
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
}

async function register(req: Request, res: Response) {
    const newUser = req.body

    const sanitizedRegister = registerSchema.safeParse(newUser)

    if (!sanitizedRegister.success) {
        throw fromZodError(sanitizedRegister.error)
    }

    const { password, ...userData } = newUser

    const userRole = await em.findOne(Role, { name: USER_ROLE.USER })

    if (!userRole) {
        const error = new Error('Credential is not valid')
        ;(error as any).statusCode = 401
        throw error
    }

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
}

//TODO (USER) Reset password from "Forgot your password?"
//In Documentation branch -> changed this method to be sanitized 
async function forgotPassword(req: Request, res: Response) {
    const sanitized = forgotPasswordSchema.safeParse(req.body)

    if (!sanitized.success) {
            const error = new Error(fromZodError(sanitized.error).message)
            ;(error as any).statusCode = 400
            throw error
        }

    const frontendUrl = env.frontendURL
    const user = await em.findOneOrFail(User, { mail: sanitized.data.mail }, { populate: ['location', 'role'] })

    mailer.sendPasswordReset(user.mail, `${frontendUrl}/auth/setup-password`, { userId: user.id! })

    res.status(200).json({ message: 'Password reset email sent' })
}

async function setupPassword(req: Request, res: Response) {
    const queryValidation = setupPasswordQuerySchema.safeParse(req.query)
    if (!queryValidation.success) {
        const error = new Error(fromZodError(queryValidation.error).message)
        ;(error as any).statusCode = 400
        throw error
    }

    const sanitized = setupPasswordSchema.safeParse(req.body)
    if (!sanitized.success) {
        const error = new Error(fromZodError(sanitized.error).message)
        ;(error as any).statusCode = 400
        throw error
    }

    const decoded = JWTUtils.verify(queryValidation.data.mailToken)
    
    const user = await em.findOneOrFail(User, { id: decoded.userId }, { populate: ['location', 'role'] })

    const userWithNewPassword = em.assign(user, {
        password: hashSync(sanitized.data.password, Number(env.defaultSaltRounds)),
    })

    await em.persistAndFlush(userWithNewPassword)

    const token = JWTUtils.getJWT({ userId: user.id! })
    setJwtCookie(res, token)

    res.status(200).json({
        message: `Updated user's password successfully`,
        data: {
            user: UserMapper.getUserResponse(userWithNewPassword),
        },
    })
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
