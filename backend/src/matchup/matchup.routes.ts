import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './matchup.controller.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'

const matchupRouter = Router()

matchupRouter.get('/', findAll)
matchupRouter.get('/:id', findOne)
matchupRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), add)
matchupRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)
matchupRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)
matchupRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), remove)

export { matchupRouter }
