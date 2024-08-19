import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './tournament.controller.js'

const tournamentRouter = Router()

tournamentRouter.get('/', findAll)
tournamentRouter.get('/:id', findOne)
tournamentRouter.post('/', add)
tournamentRouter.put('/:id', update)
tournamentRouter.patch('/:id', update)
tournamentRouter.delete('/:id', remove)

export { tournamentRouter }
