import { Request, Response } from 'express'
import { MikroOrmDatabase } from './brackets-mikro-db.js'
import { BracketsManager } from 'brackets-manager'

const storage = new MikroOrmDatabase()
const manager = new BracketsManager(storage)

async function createBracket(req: Request, res: Response) {
    try {
        const tournamentData = req.body

        //* Deberiamos sanitizar la información que ingresa
        // const sanitizedRegister = registerSchema.safeParse(newUser)
        // if (!sanitizedRegister.success) {
        //     throw fromZodError(sanitizedRegister.error)
        // }

        //* En realidad inscriptions hay que mapearlo para obtener un array de string con los nicknames.
        const { tournamentId, name, type, inscriptions } = tournamentData

        const stage = await manager.create.stage({
            tournamentId: tournamentId,
            name: name,
            type: type,
            seeding: inscriptions,
            settings: { seedOrdering: ['natural'] },
        })

        const tournamentFound = await manager.get.tournamentData(stage.tournament_id)

        res.status(200).json({
            message: 'Bracket created',
            data: { tournamentFound },
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

async function findAll(req: Request, res: Response) {
    try {
        // const stages = await storage.select('stage', { tournament_id: 3 })
        const stages = await storage.select('stage')
        const matches = await storage.select('match')
        const rounds = await storage.select('round')
        const groups = await storage.select('group')
        const participants = await storage.select('participant')

        res.status(200).json({
            message: 'Bracket created',
            data: { stages, matches, rounds, groups, participants },
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

async function getTournamentData(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)

        const tournamentData = await manager.get.tournamentData(id)

        if (!tournamentData) throw new Error(`Tournament with id ${id} doesn't exits`)

        res.status(200).json({
            message: 'Found tournament',
            data: { tournamentData },
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

async function deleteTournamentData(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)

        await manager.delete.tournament(id)

        res.status(200).json({
            message: 'Tournamente deleted succesfully',
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export { createBracket, findAll, getTournamentData, deleteTournamentData }
