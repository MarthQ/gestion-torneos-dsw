import { Router } from 'express'
import { login } from './login.controller.js'

const loginRouter = Router()

loginRouter.post('/', login)

export { loginRouter }
