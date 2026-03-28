import { Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { z } from 'zod'
import { fromError, fromZodError, ValidationError } from 'zod-validation-error'
import { compareSync, hashSync } from 'bcrypt'

import { env } from '../config/env.js'
import { ORM } from '../shared/db/orm.js'
import { User } from '../user/user.entity.js'

const em = ORM.em

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
        const user = await em.findOneOrFail(User, { mail: mail }, { populate: ['role'] })

        //* Passwords doesn't match
        if (!compareSync(password, user.password)) {
            const error = new Error('Credential is not valid (password)')
            ;(error as any).statusCode = 401
            throw error
        }

        res.status(201).json({
            message: 'User logged successfully',
            data: {
                user: user,
                token: getJWT({ id: user.id }),
            },
        })
    } catch (error: any) {
        // Custom error handling
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            })
        }

        // Zod Validation Error
        if (error.name === 'ZodValidationError' || error.details) {
            return res.status(400).json({
                message: 'Invalid login request',
                errors: error.details, // Array de errores de Zod
            })
        }

        // MikroORM Error
        if (error.name === 'EntityNotFoundError') {
            return res.status(401).json({
                message: 'Credential is not valid',
            })
        }
        // 4. Error genérico
        console.error({ errorName: error.name })
        return res.status(500).json({
            message: 'Internal server error',
        })
    }
}

async function register(req: Request, res: Response) {
    try {
        const newUser = req.body

        const sanitizedRegister = loginSchema.safeParse(newUser)

        if (!sanitizedRegister.success) {
            throw fromZodError(sanitizedRegister.error)
        }

        const { password, ...userData } = newUser

        const user = em.create(User, {
            ...userData,
            password: hashSync(newUser.password, Number(env.defaultSaltRounds)),
            role: 2,
        })

        await em.flush()

        res.status(201).json({
            message: 'User created',
            data: {
                user: user,
                token: getJWT({ id: user.id }),
            },
        })
    } catch (error: any) {
        // Custom error handling
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            })
        }

        // Zod Validation Error
        if (error.name === 'ZodValidationError' || error.details) {
            return res.status(400).json({
                message: 'Invalid register request',
                errors: error.details, // Array de errores de Zod
            })
        }

        // MikroORM Error
        if (error.name === 'EntityNotFoundError') {
            return res.status(401).json({
                message: 'Credential is not valid',
            })
        }
        // 4. Error genérico
        console.error({ errorName: error.name })
        return res.status(500).json({
            message: 'Internal server error',
        })
    }
}

//TODO

async function checkAuthStatus() {
    return
}

//* PRIVATE METHODS
function getJWT(payload: any) {
    const token = jwt.sign(payload, env.jwtSecret, {
        algorithm: 'HS256',
        expiresIn: '24h',
    })
    return token
}

export { register, login, checkAuthStatus }
