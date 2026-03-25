import { Request, Response } from 'express'
import { Tournament } from './tournament.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { Matchup } from '../matchup/matchup.entity.js'

const em = ORM.em

// TODO: Declare zod status literals

const TournamentSchema = z.object({
    id: z.number().gt(0).optional(),
    name: z.string({ message: 'Name must be a string' }),
    description: z.string({ message: 'Description must be a string' }),
    datetimeinit: z.coerce.date({ message: 'Date time must be a date' }),
    status: z.string({ message: 'Status must be a string' }),
    maxParticipants: z
        .number({ message: 'The maximum number of participants should be a number' })
        .gt(1, { message: 'The maximum number of participants should be greater than 1' }),
    game: z.number({ message: 'Game must be a number representing a game id' }),
    location: z.number({ message: 'Location must be a number representing a location id' }),
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
        res.status(404).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tournament = await em.findOneOrFail(
            Tournament,
            { id },
            { populate: ['game', 'location', 'creator', 'inscriptions', 'inscriptions.user'] },
        )
        res.status(200).json({ message: 'Found tournament', data: tournament })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
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
        await em.removeAndFlush(tournament)
        res.status(200).send({ message: 'Tournament deleted' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

function resolveBye(match: Matchup) {
    if (!match.player1Inscription || match.player2Inscription) return

    match.status = 'Finalizado'

    const winner = match.player1Inscription
    const next = match.winnerNextMatchup

    if (!next) return

    if (!next.player1Inscription) {
        next.player1Inscription = winner
    } else if (!next.player2Inscription) {
        next.player2Inscription = winner
    }

    // If next matchup now has both players, mark it as ready
    if (next.player1Inscription && next.player2Inscription) {
        next.status = 'Listo'
    }
}

async function startTournament(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tournament = await em.findOneOrFail(
            Tournament,
            { id },
            {
                populate: ['inscriptions'],
            },
        )

        if (tournament.status !== 'Abierto') {
            return res.status(400).json({ message: 'Tournament is not open' })
        }

        const inscriptions = tournament.inscriptions.getItems()

        if (inscriptions.length < 2) {
            return res.status(400).json({ message: 'Not enough participants' })
        }

        // Shuffle participants randomly. It uses (math.Random - 0.5) so it really has a 50-50 chance to either go up or down
        const shuffled = [...inscriptions].sort(() => Math.random() - 0.5)

        // Calculate rounds needed (we use log2 of participants)
        const totalRounds = Math.ceil(Math.log2(shuffled.length))

        // Generate all rounds bottom-up (from final to the first round)
        // so we can link winnerNextMatchup correctly
        const roundMatchups: Matchup[][] = []

        // Generate empty matchups for each round
        for (let round = totalRounds; round >= 1; round--) {
            const matchupsInRound = Math.pow(2, round - 1)
            const roundMatches: Matchup[] = []

            for (let i = 0; i < matchupsInRound; i++) {
                const matchup = em.create(Matchup, {
                    tournament,
                    round,
                    bracket: i === 0 ? 'Grand Final' : 'Winners',
                    status: 'Pendiente',
                    player1Rounds: 0,
                    player2Rounds: 0,
                })
                roundMatches.push(matchup)
            }
            // unshift pushes the roundMatches array to the beginning of the roundMatchups array. (This is due to the for going backwards)
            roundMatchups.unshift(roundMatches)
        }

        // Link winnerNextMatchup. The winner of each match in round N gose into one matchup in round N+1
        for (let r = 0; r < roundMatchups.length - 1; r++) {
            const currentRound = roundMatchups[r]
            const nextRound = roundMatchups[r + 1]

            for (let i = 0; i < currentRound.length; i++) {
                currentRound[i].winnerNextMatchup = nextRound[Math.floor(i / 2)]
            }
        }

        // Assign inscriptions to round 1 matchups
        const round1 = roundMatchups[0]
        for (let i = 0; i < round1.length; i++) {
            // Grab inscriptions from shuffled array in pairs
            round1[i].player1Inscription = shuffled[i * 2]
            round1[i].player2Inscription = shuffled[i * 2 + 1] ?? undefined // handle byes
            if (round1[i].player2Inscription) {
                round1[i].status = 'Listo'
            }
            resolveBye(round1[i])
        }

        tournament.status = 'En curso'
        await em.flush()

        res.status(200).json({ message: 'Tournament started', data: tournament })
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
    /* Custom functions*/
    startTournament,
}
