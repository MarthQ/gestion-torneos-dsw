import { Router } from 'express'
import { checkAuthStatus, login, register } from './auth.controller.js'
import { authenticationMiddleware } from './middlewares/authentication.middleware.js'

const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/check-status', authenticationMiddleware, checkAuthStatus)

export { authRouter }
