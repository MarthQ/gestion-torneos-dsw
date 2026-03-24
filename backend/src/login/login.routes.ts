import { Router } from 'express'
import {
    login,
    loginAdminCheck,
    loginCheck,
    logout,
} from './login.controller.js'

const loginRouter = Router()

loginRouter.post('/', login)
loginRouter.get('/check', loginCheck)
loginRouter.get('/admincheck', loginAdminCheck)
loginRouter.get('/logout', logout)

export { loginRouter }
