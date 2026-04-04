import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './inscription.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'

const inscriptionRouter = Router()

inscriptionRouter.get('/', findAll)
inscriptionRouter.get('/:id', findOne)
inscriptionRouter.post('/', authenticationMiddleware, add)
inscriptionRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)
inscriptionRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)
inscriptionRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), remove)

export { inscriptionRouter }
