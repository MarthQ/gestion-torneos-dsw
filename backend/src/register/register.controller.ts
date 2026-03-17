import { Request, Response } from 'express'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { hashSync } from 'bcrypt'
import { fromZodError } from 'zod-validation-error'
import { User } from '../user/user.entity.js'
import { Role } from '../role/role.entity.js'
import { env } from 'process'

const em = ORM.em

const registerSchema = z.object({
    name: z.string({ message: 'Username must be a string' }),
    password: z.string({ message: 'Password must be a string.' }),
    mail: z
        .string({ message: 'Mail must be a string' })
        .email({ message: 'Mail must be a valid email' }),
    location: z.number({ message: 'Location must be valid number.' }),
})

async function register(req: Request, res: Response) {
    const newUser = req.body

    const sanitizedRegister = registerSchema.safeParse(newUser)

    if (!sanitizedRegister.success) {
        throw fromZodError(sanitizedRegister.error)
    }

    try {
        const role = em.findOneOrFail(Role, { name: { $like: 'User' } })
        newUser.role = (await role).id
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
    // todo: rewrite as asynchronous
    newUser.password = hashSync(newUser.password, Number(env.defaultSaltRounds))

    try {
        em.create(User, newUser)
        await em.flush()
        res.status(201).json({ message: 'User created', data: newUser })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { register }
