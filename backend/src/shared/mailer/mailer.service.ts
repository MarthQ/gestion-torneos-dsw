import nodemailer from 'nodemailer'

import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface.js'
import { JWTUtils } from '../auth/jwt.utils.js'

import { env } from '../../config/env.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
    },
})

//TODO: Investigate how to do a injectable dependency in express
export class Mailer {
    private getResetPasswordTemplate(token: string, frontendUrl: string): string {
        const resetUrl = `http://${frontendUrl}?token=${encodeURIComponent(token)}`
        return `
    <h1>Recuperación de contraseña</h1>
    <p>Hiciste un pedido para restablecer tu contraseña.</p>
    <p>Hacé clic en el siguiente enlace (válido por 3 horas):</p>
    <a href="${resetUrl}">
        Restablecer contraseña
    </a>
    <p>Si no pediste esto, ignorá este email.</p>`
    }
    private getPasswordAsignationTemplate(token: string, frontendUrl: string): string {
        const resetUrl = `http://${frontendUrl}?token=${encodeURIComponent(token)}`
        return `
    <h1>Asignación de contraseña</h1>
    <p>Un admin creó tu cuenta por lo que debes asignar tu contraseña.</p>
    <p>Hacé clic en el siguiente enlace (válido por 3 horas):</p>
    <a href="${resetUrl}">
        Asignar mi contraseña
    </a>
    <p>Si no pediste esto, ignorá este email.</p>`
    }

    // This method centralizes the send email functionality + error handling
    private async sendEmail(mailTo: string, subject: string, html: string): Promise<void> {
        try {
            const info = await transporter.sendMail({
                from: env.mailFrom,
                to: mailTo,
                subject,
                html,
            })
            console.log(`Email sent to ${mailTo}`)
            if (info.rejected.length > 0) {
                console.warn('Some recipients were rejected:', info.rejected)
            }
        } catch (error: any) {
            switch (error.code) {
                case 'ECONNECTION':
                case 'ETIMEDOUT':
                    console.error('Network error - retry later:', error.message)
                    break
                case 'EAUTH':
                    console.error('Authentication failed:', error.message)
                    break
                case 'EENVELOPE':
                    console.error('Invalid recipients:', error.rejected)
                    break
                default:
                    console.error('Send failed:', error.message)
            }
            throw error
        }
    }

    async sendPasswordReset(mail: string, frontendUrl: string, tokenPayload: JwtPayload) {
        const token = JWTUtils.getJWT(tokenPayload)

        await this.sendEmail(mail, `Reseteo de contraseña`, this.getResetPasswordTemplate(token, frontendUrl))
    }

    async sendPasswordAsignation(mail: string, frontendUrl: string, tokenPayload: JwtPayload) {
        const token = JWTUtils.getJWT(tokenPayload)

        await this.sendEmail(
            mail,
            `Asignación de contraseña`,
            this.getPasswordAsignationTemplate(token, frontendUrl),
        )
    }
}
