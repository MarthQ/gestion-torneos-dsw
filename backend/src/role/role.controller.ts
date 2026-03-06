import { Request, Response } from 'express'
import { Role } from './role.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'

const em = ORM.em

const RoleSchema = z.object({
    id: z.number().gt(0).optional(),
    name: z.string({ message: 'Name must be a string' }),
})

async function findAll(req: Request, res: Response) {
    try {
        const Roles = await em.find(Role, {})
        res.status(200).json({
            message: 'Found all roles',
            data: Roles,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const role = await em.findOneOrFail(Role, { id })
        res.status(200).json({ message: 'Found role', data: role })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const role = em.create(Role, req.body)
        await em.flush()
        res.status(201).json({ message: 'Role created', data: role })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const role = em.getReference(Role, id)
        em.assign(role, req.body)
        await em.flush()
        res.status(200).json({ message: 'Role updated' })
    } catch (error: any) {
        res.status(500).json(error.message)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const role = em.getReference(Role, id)
        await em.removeAndFlush(role)
        res.status(200).send({ message: 'Role deleted' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { findAll, findOne, add, update, remove }
