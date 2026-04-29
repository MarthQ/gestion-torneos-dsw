import { Response, NextFunction } from 'express'

import { RequestWithUser } from '../../shared/interfaces/requestWithUser.js'
import { ORM } from '../../shared/db/orm.js'

import { User } from '../../user/user.entity.js'
import { JWTUtils } from '../../shared/auth/jwt.utils.js'
import { env } from '../../config/env.js'
import { handleHttpError } from '../../utils/http-errors.utils.js'

const em = ORM.em

export async function authenticationMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    const token = req.cookies[env.jwtCookieName]

    try {
        if (!token) {
            const error = new Error('No token')
            ;(error as any).statusCode = 401
            throw error
        }

        const decoded = JWTUtils.verify(token)

        const user = await em.findOneOrFail(User, { id: decoded.userId }, { populate: ['location', 'role'] })

        req.user = user

        // Sliding session: renew cookie on each successful request
        res.cookie(env.jwtCookieName, token, {
            httpOnly: true,
            secure: env.jwtCookieSecure, // Set to 'true' in production (HTTPS), 'false' in development (HTTP)
            sameSite: 'lax',
            maxAge: env.jwtCookieMaxAge,
            path: '/',
        })

        next()
    } catch (error: any) {
        handleHttpError(error, res)
    }
}
