import { Router } from 'express'
import {
    findAll,
    findOne,
    add,
    update,
    remove,
    findUserTournaments,
    createBracket,
    getTournamentBracket,
    getStageMatches,
    getNextReadyMatches,
    updateMatchResult,
    create,
} from './tournament.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { isOwnerOrAdminMiddleware } from '../auth/middlewares/isOwnerOrAdmin.middleware.js'

const tournamentRouter = Router()

// Find all tournaments
tournamentRouter.get('/', findAll)
// Find user's tournament
tournamentRouter.get('/userTournaments', authenticationMiddleware, findUserTournaments)
// Find tournament by id
tournamentRouter.get('/:id', findOne)
// Create tournament
tournamentRouter.post('/', authenticationMiddleware, add)
// Create tournament
tournamentRouter.post('/create', authenticationMiddleware, create)
// Create bracket
tournamentRouter.post('/:id/start', authenticationMiddleware, createBracket)
// Find tournament's bracket
tournamentRouter.get('/:id/bracket', getTournamentBracket)
// Find tournament's matches
tournamentRouter.get('/:id/matches', getStageMatches)
// Find tournament's next ready matches
tournamentRouter.get('/:id/next', getNextReadyMatches)
// Create match result (2-1)
tournamentRouter.post('/match/:id', updateMatchResult)
// Update match result (2-1)
tournamentRouter.patch('/match/:id', updateMatchResult)
// Update all tournament
tournamentRouter.put('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, update)
// Update tournament partially
tournamentRouter.patch('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, update)
// Remove tournament
tournamentRouter.delete('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, remove)

export { tournamentRouter }
