import { Request, Response } from 'express'
import { Tournament } from './tournament.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { RequestWithUser } from '../shared/interfaces/requestWithUser.js'
import { MikroOrmDatabase } from '../bracket/brackets-mikro-db.js'
import { BracketsManager } from 'brackets-manager'
import { User } from '../user/user.entity.js'
import { StageType } from '../bracket/interfaces/unions.interface.js'

const em = ORM.em

const TournamentSchema = z.object({
    name: z.string({ message: 'Name must be a string' }),
    description: z.string({ message: 'Description must be a string' }),
    datetimeinit: z.coerce.date({ message: 'Date time must be a date' }),
    status: z.string({ message: 'Status must be a string' }).optional(),
    maxParticipants: z
        .number({ message: 'The maximum number of participants should be a number' })
        .gt(1, { message: 'The maximum number of participants should be greater than 1' }),
    game: z.number({ message: 'Game must be a number representing a game id' }),
    location: z.number({ message: 'Location must be a number representing a location id' }),
    region: z.number({ message: 'Region must be a number representing a region id' }).optional(),
    creator: z.number({ message: 'Creator must be a number representing a user id' }),
    tags: z.array(z.number()),
    //TODO cambiar de tipo string a 'single_elimination' | 'double_elimination'
    type: z.string({ message: 'Type must be single_elimination or double_elimination' }),
})

const storage = new MikroOrmDatabase()
const manager = new BracketsManager(storage)

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
        res.status(404).json({ message: error.message })
    }
}

async function findUserTournaments(req: RequestWithUser, res: Response) {
    try {
        const user = req.user!

        const page = req.query.page ? Number(req.query.page) : 1
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
        const offset = (page - 1) * pageSize

        const query = req.query.query ? String(req.query.query) : undefined
        const tag = req.query.tag ? Number(req.query.tag) : undefined
        const location = req.query.location ? Number(req.query.location) : undefined
        const game = req.query.game ? Number(req.query.game) : undefined

        const filter: any = { $some: { creator: user.id } }

        if (query) filter.name = { $like: `%${query}%` }
        if (tag) filter.tags = { $some: { id: tag } }
        if (location) filter.location = location
        if (game) filter.game = game

        const tournaments = await em.find(Tournament, filter)

        res.status(200).json({
            message: 'Found all user tournaments',
            data: {
                tournaments,
            },
        })
    } catch (error: any) {
        // Custom error handling
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            })
        }

        return res.status(500).json({
            message: 'Internal server error',
        })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tournamentData = await em.findOneOrFail(
            Tournament,
            { id },
            { populate: ['game', 'location', 'creator'] },
        )

        const bracketManagerTournamentData = await manager.get.tournamentData(id)

        res.status(200).json({
            message: 'Found tournament',
            data: { tournamentData, bracketManagerTournamentData },
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function create(req: RequestWithUser, res: Response) {
    try {
        const user = req.user!

        const tournament = req.body

        tournament.creator = Number(user.id!)

        const sanitizedTournament = TournamentSchema.safeParse(req.body)

        if (!sanitizedTournament.success) {
            throw fromZodError(sanitizedTournament.error)
        }

        const tournamentData = em.create(Tournament, tournament)

        await em.flush()

        res.status(201).json({ message: 'Tournament created', data: tournamentData })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
    try {
        const sanitizedTournament = TournamentSchema.safeParse(req.body)

        if (!sanitizedTournament.success) {
            throw fromZodError(sanitizedTournament.error)
        }

        const tournament = em.create(Tournament, sanitizedTournament.data)

        await em.flush()

        res.status(201).json({ message: 'Tournament created', data: tournament })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
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
        res.status(500).json(error.message)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tournament = em.getReference(Tournament, id)
        await manager.delete.tournament(id)
        await em.removeAndFlush(tournament)
        res.status(200).send({ message: 'Tournament deleted' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

function getNearestPowerOfTwo(input: number): number {
    return Math.pow(2, Math.ceil(Math.log2(input)))
}
// bracket manager
async function createBracket(req: Request, res: Response) {
    try {
        const tournamentId = Number.parseInt(req.params.id)

        const foundTournament = await em.findOneOrFail(
            Tournament,
            { id: tournamentId },
            { populate: ['inscriptions'] },
        )

        const { name, type, inscriptions } = foundTournament

        //? Is there a more efficient way to do this?
        const displayNicknames = await Promise.all(
            inscriptions.map(async (inscription) => {
                return inscription.nickname ?? (await em.findOneOrFail(User, inscription.user)).name
            }),
        )

        const mockParticipants = [
            'Participant 1',
            'Participant 2',
            'Participant 3',
            'Participant 4',
            'Participant 5',
            'Participant 6',
            'Participant 7',
            'Participant 8',
            'Participant 9',
            'Participant 10',
        ]

        await manager.create.stage({
            name: 'Torneo de prueba',
            tournamentId: tournamentId,
            type: type as StageType,
            // seeding: displayNicknames,
            seeding: mockParticipants,
            settings: {
                seedOrdering: ['inner_outer'],
                // size: getNearestPowerOfTwo(displayNicknames.length),
                size: getNearestPowerOfTwo(mockParticipants.length),
            },
        })

        const bracketData = await manager.get.tournamentData(tournamentId)

        res.status(200).json({
            message: 'Bracket created',
            //? Should we return the data like this or nested as data: { bracketData },
            data: bracketData,
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

async function getStageMatches(req: Request, res: Response) {
    try {
        const stageId = Number.parseInt(req.params.id)

        const matches = await storage.select('match', { stage_id: stageId })

        res.status(200).json({
            message: 'Stage matches',
            data: { matches: matches ?? [] },
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

async function getNextReadyMatches(req: Request, res: Response) {
    try {
        const stageId = Number.parseInt(req.params.id)

        const matches = await manager.get.currentMatches(stageId)

        res.status(200).json({
            message: 'Next matches',
            data: { matches: matches ?? [] },
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

async function updateMatchResult(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const { score } = req.body

        if (!score || typeof score !== 'string' || !score.includes('-')) {
            throw new Error('Invalid score format. Use "X-Y" format (e.g., "3-1")')
        }

        const [score1, score2] = score.split('-').map(Number)

        if (isNaN(score1) || isNaN(score2)) {
            throw new Error('Invalid score format. Scores must be numbers')
        }

        //! We need know who opponent win the match to set result: 'win' and result: 'loss'
        const match = await manager.update.match({
            id,
            opponent1: { score: score1 },
            opponent2: { score: score2 },
            //? Is this neccesary?
            child_count: 0,
        })

        res.status(200).json({
            message: 'Match updated',
            data: { match },
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

async function getTournamentBracket(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)

        const bracketManagerTournament = await manager.get.tournamentData(id)

        res.status(200).json({
            message: 'Found Bracket',
            data: bracketManagerTournament,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export {
    findAll,
    findOne,
    add,
    update,
    remove,
    findUserTournaments,
    createBracket,
    getTournamentBracket,
    getStageMatches,
    getNextReadyMatches,
    updateMatchResult,
    create,
}
