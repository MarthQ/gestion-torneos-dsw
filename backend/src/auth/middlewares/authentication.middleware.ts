import { Response, NextFunction } from 'express'

import { RequestWithUser } from '../../shared/interfaces/requestWithUser.js'
import { ORM } from '../../shared/db/orm.js'

import { User } from '../../user/user.entity.js'
import { JWTUtils } from '../../shared/auth/jwt.utils.js'

const em = ORM.em

export async function authenticationMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'No token' })
    }

    try {
        const decoded = JWTUtils.verify(token)

        const user = await em.findOneOrFail(User, { id: decoded.userId }, { populate: ['location', 'role'] })

        req.user = user
        next()
    } catch (error: any) {
        // MikroORM Error
        if (error.name === 'NotFoundError') {
            return res.status(401).json({
                message: 'Credentials are not valid (email)',
            })
        }

        return res.status(401).json({ message: 'Invalid token' })
    }
}
