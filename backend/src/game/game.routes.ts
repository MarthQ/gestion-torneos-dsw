import { Router } from 'express'
import { findAll, searchIGDB, findOne, add, update, remove } from './game.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'

const gameRouter = Router()

gameRouter.get('/search', authenticationMiddleware, searchIGDB)
gameRouter.get('/', findAll)
gameRouter.get('/:id', findOne)
gameRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), add)
gameRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)
gameRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)
gameRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), remove)

export { gameRouter }
