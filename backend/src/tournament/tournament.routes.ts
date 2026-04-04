import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './tournament.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { isOwnerOrAdminMiddleware } from '../auth/middlewares/isOwnerOrAdmin.middleware.js'

const tournamentRouter = Router()

tournamentRouter.get('/', findAll)
tournamentRouter.get('/:id', findOne)
tournamentRouter.post('/', authenticationMiddleware, add)

tournamentRouter.put('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, update)
tournamentRouter.patch('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, update)
tournamentRouter.delete('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, remove)

export { tournamentRouter }
