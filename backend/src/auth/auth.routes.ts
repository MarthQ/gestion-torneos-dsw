import { Router } from 'express'
import { checkAuthStatus, login, register, forgotPassword, setupPassword, logout } from './auth.controller.js'
import { authenticationMiddleware } from './middlewares/authentication.middleware.js'

const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/check-status', authenticationMiddleware, checkAuthStatus)
authRouter.post('/logout', logout)

// Reset password from "Forgot your password?"
authRouter.post('/forgot-password', forgotPassword)
// Setup password using the link received by email
authRouter.post('/setup-password', setupPassword)

export { authRouter }
