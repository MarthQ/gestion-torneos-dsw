import { Response, NextFunction } from 'express'
import { RequestWithUser } from '../../shared/interfaces/requestWithUser.js'
import { USER_ROLE } from '../interfaces/user-role.const.js'

export async function isOwnerOrAdminMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        const user = req.user
        await user!.tournament.loadItems()
        const tournamentId = Number.parseInt(req.params.id)

        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }

        const ownsTournament = user.tournament.getItems().some((t) => t.id === tournamentId)
        const isAdmin = user.role.name === USER_ROLE.ADMIN

        if (!isAdmin && !ownsTournament) {
            return res.status(403).json({ message: 'Forbidden request' })
        }
        next()
    } catch (error: any) {
        console.log(`El error es el siguiente ${error}`)
    }
}
