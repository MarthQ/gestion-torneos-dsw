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
    inscribeToTournament,
    deleteInscription,
    startTournament,
    closeTournament,
    endTournament,
    cancelTournament,
} from './tournament.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { isOwnerOrAdminMiddleware } from '../auth/middlewares/isOwnerOrAdmin.middleware.js'

const tournamentRouter = Router()

//* Find all users for CRUD TOURNAMENTS admin panel
// Find all tournaments
tournamentRouter.get('/', findAll)

//* Find methods for user's tournaments
// Find user's tournament
tournamentRouter.get('/userTournaments', authenticationMiddleware, findUserTournaments)
// Find tournament by id
tournamentRouter.get('/:id', findOne)

//* Tournament created by admin panel
// Create tournament
tournamentRouter.post('/', authenticationMiddleware, add)

//* Tournament created by wizard user panel
// Create tournament
tournamentRouter.post('/create', authenticationMiddleware, create)

//* Bracket -> A bracket is generated when the inscriptions has been closed.
// The owner or admin starts the tournament. Bracket gets created
// tournamentRouter.post('/:id/start', authenticationMiddleware, createBracket)

//* Match
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

//* Inscriptions
// Inscribe to tournament
tournamentRouter.post('/:id/inscriptions', authenticationMiddleware, inscribeToTournament)
// Delete the inscription
tournamentRouter.delete('/:id/inscriptions', authenticationMiddleware, deleteInscription)

//* Tournament status transitions
// The owner or admin closes the inscriptions of the tournament
tournamentRouter.post('/:id/close', authenticationMiddleware, isOwnerOrAdminMiddleware, closeTournament)
// The owner or admin starts the tournament
tournamentRouter.post('/:id/start', authenticationMiddleware, isOwnerOrAdminMiddleware, startTournament)
// The owner or admin notifies end of the tournament
tournamentRouter.post('/:id/finish', authenticationMiddleware, isOwnerOrAdminMiddleware, endTournament)
// The owner or admin notifies cancelation of the tournament
tournamentRouter.post('/:id/cancel', authenticationMiddleware, isOwnerOrAdminMiddleware, cancelTournament)

// Update all tournament
tournamentRouter.put('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, update)
// Update tournament partially
tournamentRouter.patch('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, update)
// Remove tournament
tournamentRouter.delete('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, remove)

export { tournamentRouter }
