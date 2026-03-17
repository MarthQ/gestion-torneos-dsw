import { Router } from 'express'
import { register } from './register.controller'

const registerRouter = Router()

registerRouter.post('/', register)

export { registerRouter }
