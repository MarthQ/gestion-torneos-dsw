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
import { TournamentTypeEnum } from '../shared/interfaces/tournamentType.js'
import { TournamentStatus } from '../shared/interfaces/status.js'
import { Inscription } from '../inscription/inscription.entity.js'
import { ForeignKeyConstraintViolationException } from '@mikro-orm/core'

const em = ORM.em

const TournamentSchema = z.object({
    name: z.string({ message: 'Name must be a string' }),
    description: z.string({ message: 'Description must be a string' }),
    datetimeinit: z.coerce.date({ message: 'Date time must be a date' }),
    status: z.nativeEnum(TournamentStatus, { message: 'Status must be one of the permitted' }).optional(),
    maxParticipants: z
        .number({ message: 'The maximum number of participants should be a number' })
        .gt(1, { message: 'The maximum number of participants should be greater than 1' }),
    game: z.number({ message: 'Game must be a number representing a game id' }),
    location: z.number({ message: 'Location must be a number representing a location id' }),
    region: z.number({ message: 'Region must be a number representing a region id' }).optional(),
    creator: z.number({ message: 'Creator must be a number representing a user id' }),
    tags: z.array(z.number()),
    type: z.nativeEnum(TournamentTypeEnum, { message: 'Type must be one of the permitted' }),
})

const storage = new MikroOrmDatabase()
const manager = new BracketsManager(storage)

async function findAll(req: Request, res: Response) {
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
}

async function findUserTournaments(req: RequestWithUser, res: Response) {
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
}

async function findOne(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id)
    const tournamentData = await em.findOneOrFail(
        Tournament,
        { id },
        { populate: ['game', 'location', 'creator', 'inscriptions', 'inscriptions.user'] },
    )

    const bracketData = (await storage.select('stage', { tournament_id: id }))
        ? await manager.get.tournamentData(id)
        : null

    res.status(200).json({
        message: 'Found tournament',
        data: { tournamentData, bracket: bracketData },
    })
}

async function create(req: RequestWithUser, res: Response) {
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
}

async function add(req: Request, res: Response) {
    const sanitizedTournament = TournamentSchema.safeParse(req.body)
    if (!sanitizedTournament.success) {
        throw fromZodError(sanitizedTournament.error)
    } else {
        const tournament = em.create(Tournament, sanitizedTournament.data)
        await em.flush()
        res.status(201).json({ message: 'Tournament created', data: tournament })
    }
}

async function update(req: Request, res: Response) {
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
}

async function remove(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id)
    const tournament = em.getReference(Tournament, id)
    await manager.delete.tournament(id)
    await em.removeAndFlush(tournament)
    res.status(200).send({ message: 'Tournament deleted' })
}

function getNearestPowerOfTwo(input: number): number {
    return Math.pow(2, Math.ceil(Math.log2(input)))
}

async function closeInscriptions(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id)
    const tournament = await em.findOneOrFail(Tournament, { id }, { populate: ['inscriptions'] })

    if (tournament.status !== TournamentStatus.OPEN) {
        const error = new Error('Tournament is not open.')
        ;(error as any).statusCode = 409
        throw error
    }

    if (tournament.inscriptions.length < 2) {
        const error = new Error('Tournament must have at least 2 inscriptions to close.')
        ;(error as any).statusCode = 400
        throw error
    }

    tournament.status = TournamentStatus.CLOSED
    await em.flush()

    const foundTournament = await em.findOneOrFail(Tournament, { id }, { populate: ['inscriptions'] })

    const { name, type, inscriptions } = foundTournament

    const inscriptionNicknames = inscriptions.map((inscription) => inscription.nickname)

    await manager.create.stage({
        name: name,
        tournamentId: id,
        type: type as StageType,
        seeding: inscriptionNicknames,
        settings: {
            seedOrdering: ['inner_outer'],
            size: getNearestPowerOfTwo(inscriptionNicknames.length),
        },
    })

    const bracketData = await manager.get.tournamentData(id)

    res.status(200).json({
        message: 'Bracket created',
        data: bracketData,
    })
}

async function getStageMatches(req: Request, res: Response) {
    const stageId = Number.parseInt(req.params.id)

    const matches = await storage.select('match', { stage_id: stageId })

    res.status(200).json({
        message: 'Stage matches',
        data: { matches: matches ?? [] },
    })
}

async function getNextReadyMatches(req: Request, res: Response) {
    const stageId = Number.parseInt(req.params.id)

    const matches = await manager.get.currentMatches(stageId)

    res.status(200).json({
        message: 'Next matches',
        data: { matches: matches ?? [] },
    })
}

async function updateMatchResult(req: Request, res: Response) {
    const tournamentId = Number.parseInt(req.params.tournamentId)

    const tournament = await em.findOneOrFail(Tournament, { id: tournamentId })

    if (tournament.status !== TournamentStatus.RUNNING) {
        const error = new Error(`Tournament is not running therefore matches can't be updated.`)
        ;(error as any).statusCode = 409
        throw error
    }

    const id = Number.parseInt(req.params.id)
    const { score } = req.body

    if (!score || typeof score !== 'string' || !score.includes('-')) {
        throw new Error('Invalid score format. Use "X-Y" format (e.g., "3-1")')
    }

    const [score1, score2] = score.split('-').map(Number)

    if (isNaN(score1) || isNaN(score2)) {
        throw new Error('Invalid score format. Scores must be numbers')
    }

    const match = await manager.update.match({
        id,
        opponent1: { score: score1, result: score1 > score2 ? 'win' : 'loss' },
        opponent2: { score: score2, result: score1 < score2 ? 'win' : 'loss' },
        //? Is this neccesary?
        child_count: 0,
    })

    res.status(200).json({
        message: 'Match updated',
        data: { match },
    })
}

async function getTournamentBracket(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id)

    const bracketManagerTournament = await manager.get.tournamentData(id)

    res.status(200).json({
        message: 'Found Bracket',
        data: bracketManagerTournament,
    })
}

async function inscribeToTournament(req: RequestWithUser, res: Response) {
    const tournamentId = req.params.id ? Number(req.params.id) : undefined
    const nickname = req.body.nickname ? String(req.body.nickname) : req.user!.name

    if (!tournamentId) {
        const error = new Error('No tournament id has been supplied.')
        ;(error as any).statusCode = 400
        throw error
    }

    const tournament = await em.getReference(Tournament, tournamentId)

    // Checks if the user is not already inscribed
    const existingInscription = await em.findOne(Inscription, {
        tournament,
        user: req.user!.id,
    })

    if (existingInscription) {
        const error = new Error('User is already inscribed to tournament.')
        ;(error as any).statusCode = 409
        throw error
    }

    const inscription = em.create(Inscription, {
        nickname,
        inscriptionDate: new Date(),
        tournament,
        user: req.user!,
    })

    await em.flush()
    res.status(201).json({ message: 'Inscription added!', data: inscription })
}

async function deleteInscription(req: RequestWithUser, res: Response) {
    const tournamentId = req.params.id ? Number(req.params.id) : undefined

    if (!tournamentId) {
        const error = new Error('No tournament id has been supplied.')
        ;(error as any).statusCode = 400
        throw error
    }

    const tournament = em.getReference(Tournament, tournamentId)

    const inscription = await em.findOneOrFail(Inscription, { tournament, user: req.user })

    await em.removeAndFlush(inscription)
    res.status(200).send({ message: 'Inscription deleted' })
}

async function closeTournament(req: RequestWithUser, res: Response) {
    const id = Number(req.params.id)
    const tournament = await em.findOneOrFail(Tournament, { id })

    if (tournament.status !== TournamentStatus.OPEN) {
        const error = new Error('Tournament is not open.')
        ;(error as any).statusCode = 409
        throw error
    }

    tournament.status = TournamentStatus.CLOSED
    await em.flush()
    res.status(200).send({ message: 'Tournament has been closed!', data: tournament })
}
async function startTournament(req: RequestWithUser, res: Response) {
    const id = Number(req.params.id)
    const tournament = await em.findOneOrFail(Tournament, { id })

    if (tournament.status !== TournamentStatus.CLOSED) {
        const error = new Error('Tournament is not closed.')
        ;(error as any).statusCode = 409
        throw error
    }

    tournament.status = TournamentStatus.RUNNING
    await em.flush()
    res.status(200).send({ message: 'Tournament is now running!', data: tournament })
}

async function endTournament(req: RequestWithUser, res: Response) {
    const id = Number(req.params.id)
    const tournament = await em.findOneOrFail(Tournament, { id })

    if (tournament.status !== TournamentStatus.RUNNING) {
        const error = new Error('Tournament is not running.')
        ;(error as any).statusCode = 409
        throw error
    }

    tournament.status = TournamentStatus.FINISHED
    await em.flush()
    res.status(200).send({ message: 'The tournament has finished!', data: tournament })
}
async function cancelTournament(req: RequestWithUser, res: Response) {
    const id = Number(req.params.id)
    const tournament = await em.findOneOrFail(Tournament, { id })

    if (tournament.status === TournamentStatus.FINISHED) {
        const error = new Error('Tournament is finished and therefore cannot be cancelled.')
        ;(error as any).statusCode = 409
        throw error
    }

    tournament.status = TournamentStatus.CANCELED
    await em.flush()
    res.status(200).send({ message: 'The tournament has been canceled.', data: tournament })
}

export {
    findAll,
    findOne,
    add,
    update,
    remove,
    findUserTournaments,
    getTournamentBracket,
    getStageMatches,
    getNextReadyMatches,
    updateMatchResult,
    create,
    inscribeToTournament,
    deleteInscription,
    closeInscriptions,
    startTournament,
    endTournament,
    cancelTournament,
}
