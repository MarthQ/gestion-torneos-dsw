import { Router } from 'express'
import { login, loginCheck } from './login.controller.js'

const loginRouter = Router()

loginRouter.post('/', login)
loginRouter.get('/check/', loginCheck)

export { loginRouter }
