import { Request, Response } from 'express'
import { Tournament } from './tournament.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { handleHttpError } from '../utils/http-errors.utils.js'

const em = ORM.em

// TODO: Declare zod status literals

const TournamentSchema = z.object({
    name: z.string({ message: 'Name must be a string' }),
    description: z.string({ message: 'Description must be a string' }),
    datetimeinit: z.coerce.date({ message: 'Date time must be a date' }),
    status: z.string({ message: 'Status must be a string' }),
    maxParticipants: z
        .number({ message: 'The maximum number of participants should be a number' })
        .gt(1, { message: 'The maximum number of participants should be greater than 1' }),
    game: z.number({ message: 'Game must be a number representing a game id' }),
    location: z.number({ message: 'Location must be a number representing a location id' }),
    region: z.number({ message: 'Region must be a number representing a region id' }).optional(),
    creator: z.number({ message: 'Creator must be a number representing a user id' }),
    tags: z.array(z.number()),
})

async function findAll(req: Request, res: Response) {
    try {
        const page = req.query.page ? Number(req.query.page) : 1
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
        const offset = (page - 1) * pageSize

        const query = req.query.query ? String(req.query.query) : undefined
        const tag = req.query.tag ? Number(req.query.tag) : undefined
        const location = req.query.location ? Number(req.query.location) : undefined
        const game = req.query.game ? Number(req.query.game) : undefined

        const filter: any = {}

        if (query) filter.name = { $like: `%${query}%` }
        if (tag) filter.tags = { $some: { id: tag } }
        if (location) filter.location = location
        if (game) filter.game = game

        const Tournaments = await em.find(Tournament, filter, {
            populate: ['game', 'creator', 'location', 'tags', 'game'],
        })
        res.status(200).json({
            message: 'Found all tournaments',
            data: Tournaments,
        })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tournament = await em.findOneOrFail(
            Tournament,
            { id },
            { populate: ['game', 'location', 'creator'] },
        )
        res.status(200).json({ message: 'Found tournament', data: tournament })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function add(req: Request, res: Response) {
    try {
        const sanitizedTournament = TournamentSchema.safeParse(req.body)

        if (!sanitizedTournament.success) {
            throw fromZodError(sanitizedTournament.error)
        } else {
            const tournament = em.create(Tournament, sanitizedTournament.data)
            await em.flush()
            res.status(201).json({ message: 'Tournament created', data: tournament })
        }
    } catch (error: any) {
        handleHttpError(error, res)
    }
}
async function update(req: Request, res: Response) {
    try {
        const sanitizedTournament = TournamentSchema.partial().safeParse(req.body)

        if (!sanitizedTournament.success) {
            throw fromZodError(sanitizedTournament.error)
        } else {
            const id = Number.parseInt(req.params.id)
            const tournament = await em.findOneOrFail(Tournament, id)

            em.assign(tournament, sanitizedTournament.data)
            await em.flush()
        }
        res.status(200).json({ message: 'Tournament updated' })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tournament = em.getReference(Tournament, id)
        await em.removeAndFlush(tournament)
        res.status(200).send({ message: 'Tournament deleted' })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

export { findAll, findOne, add, update, remove }
