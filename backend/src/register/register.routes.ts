import { Router } from 'express'
import { register } from './register.controller.js'

const registerRouter = Router()

registerRouter.post('/', register)

export { registerRouter }
