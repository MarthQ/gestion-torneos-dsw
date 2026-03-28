import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './tournament.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'

const tournamentRouter = Router()

tournamentRouter.get('/', findAll)
tournamentRouter.get('/:id', findOne)
tournamentRouter.post('/', authenticationMiddleware, add)
tournamentRouter.put('/:id', authenticationMiddleware, update)
tournamentRouter.patch('/:id', authenticationMiddleware, update)
tournamentRouter.delete('/:id', authenticationMiddleware, remove)

export { tournamentRouter }
