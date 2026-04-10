import { Router } from 'express'
import { checkAuthStatus, login, register, forgotPassword, setupPassword, logout } from './auth.controller.js'
import { authenticationMiddleware } from './middlewares/authentication.middleware.js'
import { wrapController } from '../utils/http-errors.utils.js'

const authRouter = Router()

authRouter.post('/register', wrapController(register))
authRouter.post('/login', wrapController(login))
authRouter.get('/check-status', authenticationMiddleware, wrapController(checkAuthStatus))
authRouter.post('/logout', wrapController(logout))

// Reset password from "Forgot your password?"
authRouter.post('/forgot-password', wrapController(forgotPassword))
// Setup password using the link received by email
authRouter.post('/setup-password', wrapController(setupPassword))

export { authRouter }
