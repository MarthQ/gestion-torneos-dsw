import { Request, Response } from 'express'
import { Inscription } from './inscription.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

const em = ORM.em

const InscriptionSchema = z.object({
    id: z.number().gt(0).optional(),
    nickname: z.string({ message: 'Nickname must be a string' }),
    inscriptionDate: z.string().datetime({ message: 'The inscription date must be a date' }),
    points: z.number({ message: 'Points must be a number' }),
    tournament: z.number({ message: 'Tournament must be a number representing a tournament id' }),
    user: z.number({ message: 'User must be a number representing a user id' }),
})

async function findAll(req: Request, res: Response) {
    try {
        const page = req.query.page ? Number(req.query.page) : undefined
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined

        const tournament = req.query.tournament ? Number(req.query.tournament) : undefined
        const user = req.query.user ? Number(req.query.user) : undefined

        const filter: any = {}

        if (tournament) filter.tournament = tournament
        if (user) filter.user = user

        if (page && pageSize) {
            const [inscriptions, total] = await em.findAndCount(Inscription, filter, {
                limit: pageSize,
                offset: (page - 1) * pageSize,
            })
            return res.status(200).json({
                message: 'Found paginated inscriptions',
                data: inscriptions,
                meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
            })
        }

        const inscriptions = await em.find(Inscription, filter, { populate: ['user', 'tournament'] })
        res.status(200).json({
            message: 'Found all inscriptions',
            data: inscriptions,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const inscription = await em.findOneOrFail(Inscription, { id }, { populate: ['user', 'tournament'] })
        res.status(200).json({ message: 'Found inscription', data: inscription })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const sanitizedInscription = InscriptionSchema.safeParse(req.body)

        if (!sanitizedInscription.success) {
            throw fromZodError(sanitizedInscription.error)
        } else {
            const inscription = em.create(Inscription, sanitizedInscription.data)
            await em.flush()
            res.status(201).json({ message: 'Inscription added', data: inscription })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
async function update(req: Request, res: Response) {
    try {
        const sanitizedInscription = InscriptionSchema.partial().safeParse(req.body)

        if (!sanitizedInscription.success) {
            throw fromZodError(sanitizedInscription.error)
        } else {
            const id = Number.parseInt(req.params.id)
            const inscription = em.getReference(Inscription, id)
            em.assign(inscription, sanitizedInscription.data)
            await em.flush()
            res.status(200).json({ message: 'Inscription updated' })
        }
    } catch (error: any) {
        res.status(500).json(error.message)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const inscription = em.getReference(Inscription, id)
        await em.removeAndFlush(inscription)
        res.status(200).send({ message: 'Inscription deleted' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { findAll, findOne, add, update, remove }
