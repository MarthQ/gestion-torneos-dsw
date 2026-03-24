import { Request, Response } from 'express'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { compareSync } from 'bcrypt'
import { fromZodError } from 'zod-validation-error'
import { User } from '../user/user.entity.js'
import { env } from '../config/env.js'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Role } from '../role/role.entity.js'

const em = ORM.em

const registerSchema = z.object({
    mail: z
        .string({ message: 'Mail must be a string' })
        .email({ message: 'Mail must be a valid email' }),
    password: z.string({ message: 'Password must be a string.' }),
})

async function login(req: Request, res: Response) {
    const sanitizedLogin = registerSchema.safeParse(req.body)

    if (!sanitizedLogin.success) {
        throw fromZodError(sanitizedLogin.error)
    }

    try {
        const loginuser = await em.findOneOrFail(User, { mail: req.body.mail })
        // todo: rewrite as asynchronous
        if (compareSync(req.body.password, loginuser.password) == true) {
            const newPayload = {
                userID: loginuser.id,
                roleID: loginuser.role.id,
            }

            jwt.sign(
                newPayload,
                env.jwtSecret,
                { algorithm: 'HS256', expiresIn: '24h' },
                function (err, token) {
                    const userToken = token
                    res.cookie('token', userToken, {
                        httpOnly: true,
                        secure: true,
                    })
                    res.status(201).json({
                        message: 'User login successful',
                    })
                    if (err) {
                        throw err
                    }
                },
            )
        } else throw new Error()
    } catch (error: any) {
        res.status(401).json({ message: 'Invalid Login data.' })
    }
}

async function loginAdminCheck(req: Request, res: Response) {
    const token = req.cookies.token
    try {
        const decoded = jwt.verify(token, env.jwtSecret, {
            algorithms: ['HS256'],
        }) as JwtPayload & { userID: string; roleID: string }
        const id = Number(decoded.userID)
        const user = await em.findOneOrFail(User, { id })
        const adminRole = await em.findOneOrFail(Role, {
            name: { $like: 'Admin' },
        })

        if (Number(user.role.id) != adminRole.id) {
            throw Error('Invalid role.')
        }
        return res.status(200).json({ message: 'User is an admin' })
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

async function loginCheck(req: Request, res: Response) {
    const token = req.cookies.token
    try {
        const decoded = jwt.verify(token, env.jwtSecret, {
            algorithms: ['HS256'],
        }) as JwtPayload & { userID: string; roleID: string }
        const id = Number(decoded.userID)
        const user = await em.findOneOrFail(User, { id })
        return res.status(200).json({ message: 'User is logged in.' })
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

async function logout(req: Request, res: Response) {
    if (req.cookies.token) {
        try {
            res.clearCookie('token')
            res.status(200).json({ message: 'Succesfully logged out.' })
        } catch (err) {
            return res.status(500).json({ message: 'Error in logout.' })
        }
    }
}

export { login, loginAdminCheck, loginCheck, logout }
