import { Request, Response } from 'express'
import { User } from './user.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

const em = ORM.em

const UserSchema = z.object({
    id: z.number().gt(0).optional(),
    name: z.string({ message: 'Name must be a string' }),
    password: z.string({ message: 'Password must be a string' }),
    Mail: z.string({ message: 'Mail must be a string' }),
    location: z.number({ message: 'Location must be a number representing a location id' }),
})

async function findAll(req: Request, res: Response) {
    try {
        const Users = await em.find(User, {}, { populate: ['location'] })
        res.status(200).json({
            message: 'Found all users',
            data: Users,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const user = await em.findOneOrFail(User, { id }, { populate: ['location'] })
        res.status(200).json({ message: 'Found user', data: user })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const user = em.create(User, req.body)
        await em.flush()
        res.status(201).json({ message: 'User created', data: user })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const user = em.getReference(User, id)
        em.assign(user, req.body)
        await em.flush()
        res.status(200).json({ message: 'User updated' })
    } catch (error: any) {
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
