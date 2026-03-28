import { Response, NextFunction } from 'express'
import { RequestWithUser } from '../../shared/interfaces/requestWithUser.js'
import { Role } from '../../role/role.entity.js'

export function authorizeMiddleware(...allowedRoles: Role[]) {
    return (req: RequestWithUser, res: Response, next: NextFunction) => {
        const user = req.user

        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }

        const userRole = user.role

        if (!allowedRoles.includes(userRole)) {
            return res.status(401).json({ message: `User ${user.name} need a valid role: [${allowedRoles}]` })
        }

        next()
    }
}
