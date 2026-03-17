import { Request, Response } from 'express'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { compareSync } from 'bcrypt'
import { fromZodError } from 'zod-validation-error'
import { User } from '../user/user.entity.js'
import { env } from 'process'
import jwt from 'jsonwebtoken'

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
                roleID: loginuser.role,
            }

            jwt.sign(newPayload, String(env.jwtSecret), function (err, token) {
                const userToken = token
                res.status(201).json({
                    message: 'User login successful',
                    data: userToken,
                })
                if (err) {
                    throw err
                }
            })
        } else throw new Error()
    } catch (error: any) {
        res.status(401).json({ message: 'Invalid Login data.' })
    }
}

export { login }
