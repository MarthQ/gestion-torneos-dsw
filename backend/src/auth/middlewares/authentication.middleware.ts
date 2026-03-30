import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { RequestWithUser } from '../../shared/interfaces/requestWithUser.js'
import { ORM } from '../../shared/db/orm.js'
import { env } from '../../config/env.js'
import { User } from '../../user/user.entity.js'
import { JwtPayload } from '../interfaces/jwt-payload.interface.js'

const em = ORM.em

export async function authenticationMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'No token' })
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret, {
            algorithms: ['HS256'],
        }) as JwtPayload

        const user = await em.findOneOrFail(User, { id: decoded.userId }, { populate: ['location', 'role'] })

        if (!user) {
            return res.status(401).json({ message: 'Invalid user' })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}
