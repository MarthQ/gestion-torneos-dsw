import { Response, NextFunction } from 'express'
import { RequestWithUser } from '../../shared/interfaces/requestWithUser.js'
import { handleHttpError } from '../../utils/http-errors.utils.js'
import { BracketsManager } from 'brackets-manager'
import { MikroOrmDatabase } from '../../bracket/brackets-mikro-db.js'
import { ORM } from '../../shared/db/orm.js'
import { Tournament } from '../tournament.entity.js'
import { USER_ROLE } from '../../auth/interfaces/user-role.const.js'

const em = ORM.em
const storage = new MikroOrmDatabase()
const manager = new BracketsManager(storage)

export async function updateMatchMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        const user = req.user

        if (!user) {
            const error = new Error('User not found')
            ;(error as any).statusCode = 401
            throw error
        }

        const tournamentId = Number.parseInt(req.params.tournamentId)
        const matchId = Number.parseInt(req.params.id)

        const tournament = await em.findOneOrFail(Tournament, tournamentId, {
            populate: ['inscriptions', 'creator'],
        })

        // ADMIN
        if (user.role?.name === USER_ROLE.ADMIN) {
            return next()
        }

        // DUEÑO DEL TORNEO
        if (tournament.creator.id === user.id) {
            return next()
        }

        // TRAER DATA NECESARIA
        const data = await manager.get.tournamentData(tournamentId)
        const participants = data.participant

        const matchs = await manager.storage.select('match', { id: matchId })
        if (matchs?.length === 0) return
        const match = matchs!.at(0)!

        // IDs de los oponentes
        const opponentIds = [match.opponent1?.id, match.opponent2?.id].filter(Boolean)

        // Buscar nombres de esos participantes
        const opponentNames = participants.filter((p) => opponentIds.includes(p.id)).map((p) => p.name)

        // Buscar inscription del usuario
        await tournament.inscriptions.loadItems()

        const userInscription = tournament.inscriptions.getItems().find((ins: any) => ins.user.id === user.id)

        if (!userInscription) {
            return res.status(403).json({ message: 'User not in tournament' })
        }

        // VALIDACIÓN FINAL
        const isPlayerInMatch = opponentNames.includes(userInscription.nickname)

        if (!isPlayerInMatch) {
            return res.status(403).json({ message: 'Not allowed to update this match' })
        }

        next()
    } catch (error: any) {
        handleHttpError(error, res)
    }
}
