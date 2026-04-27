import { Request, Response } from 'express'
import { Inscription } from './inscription.entity.js'
import { ORM } from '../shared/db/orm.js'
import { fromZodError } from 'zod-validation-error'
import { InscriptionSchema } from './inscription.schema.js'

const em = ORM.em

async function findAll(req: Request, res: Response) {
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
            populate: ['user'],
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
}

async function findOne(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id)
    const inscription = await em.findOneOrFail(Inscription, { id }, { populate: ['user', 'tournament'] })
    res.status(200).json({ message: 'Found inscription', data: inscription })
}

async function add(req: Request, res: Response) {
    const sanitizedInscription = InscriptionSchema.safeParse(req.body)

    if (!sanitizedInscription.success) {
        throw fromZodError(sanitizedInscription.error)
    } else {
        const inscription = em.create(Inscription, sanitizedInscription.data)
        await em.flush()
        res.status(201).json({ message: 'Inscription added', data: inscription })
    }
}
async function update(req: Request, res: Response) {
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
}

async function remove(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id)
    const inscription = em.getReference(Inscription, id)
    await em.removeAndFlush(inscription)
    res.status(200).send({ message: 'Inscription deleted' })
}

export { findAll, findOne, add, update, remove }
