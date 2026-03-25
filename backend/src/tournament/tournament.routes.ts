import { Router } from 'express'
import { findAll, findOne, add, update, remove, startTournament } from './tournament.controller.js'

const tournamentRouter = Router()

tournamentRouter.get('/', findAll)
tournamentRouter.get('/:id', findOne)
tournamentRouter.post('/', add)
tournamentRouter.put('/:id', update)
tournamentRouter.patch('/:id', update)
tournamentRouter.delete('/:id', remove)

// Custom routes for custom methods
tournamentRouter.post('/:id/start', startTournament)

export { tournamentRouter }
