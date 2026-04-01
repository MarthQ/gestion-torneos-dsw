import jwt from 'jsonwebtoken'

import { env } from '../../config/env.js'

import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface.js'

export class JWTUtils {
    static verify(token: string): JwtPayload {
        return jwt.verify(token, env.jwtSecret, {
            algorithms: ['HS256'],
        }) as JwtPayload
    }

    static getJWT(payload: JwtPayload) {
        const token = jwt.sign(payload, env.jwtSecret, {
            algorithm: 'HS256',
            expiresIn: '24h',
        })
        return token
    }
}
