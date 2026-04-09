import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './tournament.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { isOwnerOrAdminMiddleware } from '../auth/middlewares/isOwnerOrAdmin.middleware.js'
import { wrapController } from '../utils/http-errors.utils.js'

const tournamentRouter = Router()

tournamentRouter.get('/', wrapController(findAll))
tournamentRouter.get('/:id', wrapController(findOne))
tournamentRouter.post('/', authenticationMiddleware, wrapController(add))

tournamentRouter.put('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, wrapController(update))
tournamentRouter.patch('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, wrapController(update))
tournamentRouter.delete('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, wrapController(remove))

export { tournamentRouter }
