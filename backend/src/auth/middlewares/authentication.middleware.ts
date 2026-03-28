import { Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { RequestWithUser } from '../../shared/interfaces/requestWithUser.js'
import { ORM } from '../../shared/db/orm.js'
import { env } from '../../config/env.js'
import { User } from '../../user/user.entity.js'

const em = ORM.em

export async function authenticationMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'No token' })
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] }) as JwtPayload & {
            userId: string
        }

        const user = await em.findOneOrFail(User, { id: decoded.userId })

        if (!user) {
            return res.status(401).json({ message: 'Invalid user' })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}
