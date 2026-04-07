import { Response, NextFunction } from 'express'
import { RequestWithUser } from '../../shared/interfaces/requestWithUser.js'
import { USER_ROLE } from '../interfaces/user-role.const.js'
import { handleHttpError } from '../../utils/http-errors.utils.js'

export async function isOwnerOrAdminMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        const user = req.user
        await user!.tournament.loadItems()
        const tournamentId = Number.parseInt(req.params.id)

        if (!user) {
            const error = new Error('User not found')
            ;(error as any).statusCode = 401
            throw error
        }

        const ownsTournament = user.tournament.getItems().some((t) => t.id === tournamentId)
        const isAdmin = user.role.name === USER_ROLE.ADMIN

        if (!isAdmin && !ownsTournament) {
            const error = new Error('Forbidden request')
            ;(error as any).statusCode = 403
            throw error
        }
        next()
    } catch (error: any) {
        handleHttpError(error, res)
    }
}
