import { Router } from 'express'
import {
    findAll,
    findOne,
    add,
    update,
    remove,
} from './tournament.controller.js'
import { authAdminMiddleware } from '../login/auth.middleware.js'

const tournamentRouter = Router()

tournamentRouter.get('/', findAll)
tournamentRouter.get('/:id', findOne)
tournamentRouter.post('/', authAdminMiddleware, add)
tournamentRouter.put('/:id', authAdminMiddleware, update)
tournamentRouter.patch('/:id', authAdminMiddleware, update)
tournamentRouter.delete('/:id', authAdminMiddleware, remove)

export { tournamentRouter }
