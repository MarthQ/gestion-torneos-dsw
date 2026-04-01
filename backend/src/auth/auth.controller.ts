import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { fromError, fromZodError, ValidationError } from 'zod-validation-error'
import { compareSync, hashSync } from 'bcrypt'

import { env } from '../config/env.js'
import { ORM } from '../shared/db/orm.js'
import { User } from '../user/user.entity.js'
import { Role } from '../role/role.entity.js'
import { USER_ROLE } from './interfaces/user-role.const.js'
import { RequestWithUser } from '../shared/interfaces/requestWithUser.js'
import { JwtPayload } from './interfaces/jwt-payload.interface.js'

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
        const user = await em.findOneOrFail(User, { mail: mail }, { populate: ['role', 'location'] })

        //* if Passwords doesn't match
        if (!compareSync(password, user.password)) {
            const error = new Error('Credential is not valid (password)')
            ;(error as any).statusCode = 401
            throw error
        }

        res.status(200).json({
            message: 'User logged successfully',
            data: {
                user: getUserResponse(user),
                token: getJWT({ userId: user.id! }),
            },
        })
    } catch (error: any) {
        console.log(error)
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
        if (error.name === 'NotFoundError') {
            return res.status(401).json({
                message: 'Credentials are not valid (email)',
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

        res.status(201).json({
            message: 'User created',
            data: {
                user: getUserResponse(user),
                token: getJWT({ userId: user.id! }),
            },
        })
    } catch (error: any) {
        // General error
        console.error({
            name: error.name,
            message: error.message,
            code: error.code,
            detail: error.sqlMessage || error.detail,
        })
        // Zod Validation Error
        if (error.name === 'ZodValidationError' || error.details) {
            return res.status(400).json({
                message: 'Invalid register request',
                errors: error.details, // Array de errores de Zod
            })
        }
        // MikroORM Error
        if (error.name === 'NotFoundError') {
            return res.status(401).json({
                message: "Rol user doesn't exist in db",
            })
        }
        // MikroORM Error
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

        return res.status(500).json({
            message: 'Internal server error',
        })
    }
}

//TODO

async function checkAuthStatus(req: RequestWithUser, res: Response) {
    const user = req.user!

    return res.status(201).json({
        message: 'User authenticated',
        data: {
            user: getUserResponse(user),
            token: getJWT({ userId: user.id! }),
        },
    })
}

//* PRIVATE METHODS
function getJWT(payload: JwtPayload) {
    const token = jwt.sign(payload, env.jwtSecret, {
        algorithm: 'HS256',
        expiresIn: '24h',
    })
    return token
}

function getUserResponse(user: User) {
    return {
        id: user.id,
        name: user.name,
        mail: user.mail,
        location: user.location,
        role: user.role,
    }
}

export { register, login, checkAuthStatus }
