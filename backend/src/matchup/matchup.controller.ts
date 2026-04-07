import { Request, Response } from 'express'
import { Matchup } from './matchup.entity.js'
import { ORM } from '../shared/db/orm.js'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { handleHttpError } from '../utils/http-errors.utils.js'

const em = ORM.em

const matchupSchema = z.object({
    player1Rounds: z
        .number({ message: 'Rounds must be a number' })
        .gt(0, { message: 'Rounds must be greater to 0' }),
    player2Rounds: z
        .number({ message: 'Rounds must be a number' })
        .gt(0, { message: 'Rounds must be greater to 0' }),
    status: z.string({ message: 'Status must be a string' }),
    bracket: z.string({ message: 'Bracket must be a string' }),
    round: z.number({ message: 'Round must be a number' }),
    player1Inscription: z
        .number({ message: 'Player 1 ID must be a number referencing a Inscription' })
        .optional(),
    player2Inscription: z
        .number({ message: 'Player 2 ID must be a number referencing a Inscription' })
        .optional(),
    winnerInscription: z.number({ message: "Winner's ID must be a number" }).optional(),
    tournament: z.number({ message: 'Tournament must be a number' }),
    winnerNextMatchup: z.number({ message: 'Matchup ID must be a number' }).optional(),
    losersNextMatchup: z.number({ message: 'Matchup ID must be a number' }).optional(),
})

async function findAll(req: Request, res: Response) {
    try {
        const Matchups = await em.find(Matchup, {})
        res.status(200).json({
            message: 'Found all matchups',
            data: Matchups,
        })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const matchup = await em.findOneOrFail(Matchup, { id })
        res.status(200).json({ message: 'Found matchup', data: matchup })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function add(req: Request, res: Response) {
    try {
        const sanitizedMatchup = matchupSchema.safeParse(req.body)

        if (!sanitizedMatchup.success) {
            throw fromZodError(sanitizedMatchup.error)
        } else {
            const matchup = em.create(Matchup, sanitizedMatchup.data)
            await em.flush()
            res.status(201).json({ message: 'Matchup added', data: matchup })
        }
    } catch (error: any) {
        handleHttpError(error, res)
    }
}
async function update(req: Request, res: Response) {
    try {
        const sanitizedMatchup = matchupSchema.partial().safeParse(req.body)

        if (!sanitizedMatchup.success) {
            throw fromZodError(sanitizedMatchup.error)
        } else {
            const id = Number.parseInt(req.params.id)
            const matchup = em.getReference(Matchup, id)
            em.assign(matchup, sanitizedMatchup.data)
            await em.flush()
            res.status(200).json({ message: 'Matchup updated' })
        }
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const matchup = em.getReference(Matchup, id)
        await em.removeAndFlush(matchup)
        res.status(200).send({ message: 'Matchup deleted' })
    } catch (error: any) {
        handleHttpError(error, res)
    }
}

export { findAll, findOne, add, update, remove }
