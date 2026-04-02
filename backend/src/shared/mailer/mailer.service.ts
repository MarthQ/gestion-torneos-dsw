import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface.js'
import { JWTUtils } from '../auth/jwt.utils.js'

//TODO: Investigate how to do a injectable dependency in express
export class Mailer {
    async sendEmail(mail: string, frontendUrl: string, tokenPayload: JwtPayload) {
        const token = JWTUtils.getJWT(tokenPayload)

        console.log(`La url es ${frontendUrl}`)
        console.log(`El token es ${token}`)

        console.log(`El token es -${frontendUrl}/auth/setup-password?token=${token}-`)

        // Genero la url con token
        // Envio por mail la url con token
        // Si todo salió termina sino tira un error
    }
}
