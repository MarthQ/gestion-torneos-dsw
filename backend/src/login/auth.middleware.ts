// src/login/auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ORM } from '../shared/db/orm.js'
import { User } from '../user/user.entity.js'
import { env } from '../config/env.js'
import { Role } from '../role/role.entity.js'

const em = ORM.em

async function authAdminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const header = req.headers.authorization
    const token = header?.startsWith('Bearer ')
        ? header.slice(7).trim()
        : undefined

    if (!token) return res.status(401).json({ message: 'Missing auth token' })

    try {
        const decoded = jwt.verify(token, env.jwtSecret, {
            algorithms: ['HS256'],
        }) as JwtPayload & { userID: string; roleID: string }

        const id = Number(decoded.userID)
        const user = await em.findOneOrFail(User, { id })
        const adminRole = await em.findOneOrFail(Role, {
            name: { $like: 'Admin' },
        })

        if (Number(user.role) != adminRole.id) {
            throw Error('Invalid role.')
        }
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

export { authAdminMiddleware }
