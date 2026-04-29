import { Router } from 'express'
import {
    findAll,
    findOne,
    add,
    update,
    remove,
    findUserTournaments,
    getTournamentBracket,
    getStageMatches,
    getNextReadyMatches,
    updateMatchResult,
    create,
    inscribeToTournament,
    deleteInscription,
    startTournament,
    closeInscriptions,
    endTournament,
    cancelTournament,
    reshuffleBracket,
    reopenTournament,
    streamTournamentBracket,
} from './tournament.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { isOwnerOrAdminMiddleware } from '../auth/middlewares/isOwnerOrAdmin.middleware.js'
import { wrapController } from '../utils/http-errors.utils.js'

const tournamentRouter = Router()

//* Find all users for CRUD TOURNAMENTS admin panel
// Find all tournaments
tournamentRouter.get('/', wrapController(findAll))

//* Find methods for user's tournaments
// Find user's tournament
tournamentRouter.get('/userTournaments', authenticationMiddleware, wrapController(findUserTournaments))
// Find tournament by id
tournamentRouter.get('/:id', wrapController(findOne))

//* Tournament created by admin panel
// Create tournament
tournamentRouter.post('/', authenticationMiddleware, wrapController(add))

//* Tournament created by wizard user panel
// Create tournament
tournamentRouter.post('/create', authenticationMiddleware, wrapController(create))

//* Bracket -> A bracket is generated when the inscriptions has been closed.
tournamentRouter.post(
    '/:id/bracket/change',
    authenticationMiddleware,
    isOwnerOrAdminMiddleware,
    wrapController(reshuffleBracket),
)

//* Match
// Find tournament's bracket
tournamentRouter.get('/:id/bracket', wrapController(getTournamentBracket))
// SSE Streaming for update on tournament's bracket
tournamentRouter.get('/:id/bracket/stream', wrapController(streamTournamentBracket))

// Find tournament's matches
tournamentRouter.get('/:id/matches', wrapController(getStageMatches))
// Find tournament's next ready matches
tournamentRouter.get('/:id/next', wrapController(getNextReadyMatches))
// Create match result (2-1)
tournamentRouter.post('/:tournamentId/match/:id', wrapController(updateMatchResult))
// Update match result (2-1)
tournamentRouter.patch('/:tournamentId/match/:id', wrapController(updateMatchResult))

//* Inscriptions
// Inscribe to tournament
tournamentRouter.post('/:id/inscriptions', authenticationMiddleware, wrapController(inscribeToTournament))
// Delete the inscription
tournamentRouter.delete('/:id/inscriptions', authenticationMiddleware, wrapController(deleteInscription))

//* Tournament status transitions
// The owner or admin closes the inscriptions of the tournament
tournamentRouter.post(
    '/:id/close',
    authenticationMiddleware,
    isOwnerOrAdminMiddleware,
    wrapController(closeInscriptions),
)
// The owner or admin starts the tournament. Bracket gets created
tournamentRouter.post(
    '/:id/start',
    authenticationMiddleware,
    isOwnerOrAdminMiddleware,
    wrapController(startTournament),
)
// The owner or admin notifies end of the tournament
tournamentRouter.post(
    '/:id/finish',
    authenticationMiddleware,
    isOwnerOrAdminMiddleware,
    wrapController(endTournament),
)
tournamentRouter.post(
    '/:id/reopen',
    authenticationMiddleware,
    isOwnerOrAdminMiddleware,
    wrapController(reopenTournament),
)
// The owner or admin notifies cancelation of the tournament
tournamentRouter.post(
    '/:id/cancel',
    authenticationMiddleware,
    isOwnerOrAdminMiddleware,
    wrapController(cancelTournament),
)

// Update all tournament
tournamentRouter.put('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, wrapController(update))
// Update tournament partially
tournamentRouter.patch('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, wrapController(update))
// Remove tournament
tournamentRouter.delete('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, wrapController(remove))

export { tournamentRouter }
