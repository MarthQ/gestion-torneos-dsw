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
} from './tournament.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { isOwnerOrAdminMiddleware } from '../auth/middlewares/isOwnerOrAdmin.middleware.js'
import { wrapController } from '../utils/http-errors.utils.js'

const tournamentRouter = Router()

/**
 * @swagger
 * /tournaments:
 *   get:
 *     summary: Lista todos los torneos
 *     tags: [Tournaments]
 *     responses:
 *       200:
 *         description: Se recuperaron todos los torneos
 *       501:
 *         description: Servicio no disponible
 */
tournamentRouter.get('/', wrapController(findAll))

/**
 * @swagger
 * /tournaments/{id}:
 *   get:
 *     summary: Recupera un torneo específico
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Torneo encontrado
 *       400:
 *         description: Formato de ID inválido
 *       404:
 *         description: Torneo no encontrado
 *       500:
 *         description: Error interno
 */
tournamentRouter.get('/:id', wrapController(findOne))

/**
 * @swagger
 * /tournaments:
 *   post:
 *     summary: Crea un nuevo torneo
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tournament'
 *     responses:
 *       201:
 *         description: Torneo creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 */
tournamentRouter.post('/', authenticationMiddleware, wrapController(add))

/**
 * @swagger
 * /tournaments/{id}:
 *   put:
 *     summary: Actualiza totalmente un torneo existente
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tournament'
 *     responses:
 *       200:
 *         description: Torneo actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Torneo no encontrado
 */
tournamentRouter.put('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, wrapController(update))

/**
 * @swagger
 * /tournaments/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un torneo existente
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tournament'
 *     responses:
 *       200:
 *         description: Torneo actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Torneo no encontrado
 */
tournamentRouter.patch('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, wrapController(update))

/**
 * @swagger
 * /tournaments/{id}:
 *   delete:
 *     summary: Borra un torneo existente
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Torneo borrado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Torneo no encontrado
 *       500:
 *         description: Error interno
 */
tournamentRouter.delete('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, wrapController(remove))


//* Find methods for user's tournaments
// Find user's tournament

/**
 * @swagger
 * /tournaments/userTournaments:
 *   get:
 *     summary: Lista los torneos del usuario autenticado
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Torneos del usuario encontrados
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error interno
 */
tournamentRouter.get('/userTournaments', authenticationMiddleware, wrapController(findUserTournaments))

//* Tournament created by wizard user panel
// Create tournament

/**
 * @swagger
 * /tournaments/create:
 *   post:
 *     summary: Crea un torneo desde el panel de usuario
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tournament'
 *     responses:
 *       201:
 *         description: Torneo creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       409:
 *         description: Referencia inválida a recurso relacionado
 *       500:
 *         description: Error interno
 */
tournamentRouter.post('/create', authenticationMiddleware, wrapController(create))

//* Bracket -> A bracket is generated when the inscriptions has been closed.

//* Match
// Find tournament's bracket

/**
 * @swagger
 * /tournaments/{id}/bracket:
 *   get:
 *     summary: Obtiene el bracket de un torneo
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bracket encontrado
 *       422:
 *         description: Torneo no encontrado
 *       500:
 *         description: Error interno
 */
tournamentRouter.get('/:id/bracket', wrapController(getTournamentBracket))
// Find tournament's matches

/**
 * @swagger
 * /tournaments/{id}/matches:
 *   get:
 *     summary: Obtiene los partidos de una etapa del torneo
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la etapa
 *     responses:
 *       200:
 *         description: Partidos encontrados
 *       500:
 *         description: Error interno
 */
tournamentRouter.get('/:id/matches', wrapController(getStageMatches))
// Find tournament's next ready matches

/**
 * @swagger
 * /tournaments/{id}/next:
 *   get:
 *     summary: Obtiene los próximos partidos listos para jugarse
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la etapa
 *     responses:
 *       200:
 *         description: Próximos partidos encontrados
 *       500:
 *         description: Error interno
 */
tournamentRouter.get('/:id/next', wrapController(getNextReadyMatches))
// Create match result (2-1)

/**
 * @swagger
 * /tournaments/{tournamentId}/match/{id}:
 *   post:
 *     summary: Carga el resultado de un partido
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del partido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: string
 *                 example: "3-1"
 *     responses:
 *       200:
 *         description: Resultado cargado exitosamente
 *       400:
 *         description: Formato de score inválido
 *       409:
 *         description: El torneo no está en estado RUNNING
 *       422:
 *         description: Torneo no encontrado
 *       500:
 *         description: Error interno
 */
tournamentRouter.post('/:tournamentId/match/:id', wrapController(updateMatchResult))
// Update match result (2-1)

/**
 * @swagger
 * /tournaments/{tournamentId}/match/{id}:
 *   patch:
 *     summary: Actualiza el resultado de un partido
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del partido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: string
 *                 example: "3-1"
 *     responses:
 *       200:
 *         description: Resultado actualizado exitosamente
 *       400:
 *         description: Formato de score inválido
 *       409:
 *         description: El torneo no está en estado RUNNING
 *       422:
 *         description: Torneo no encontrado
 *       500:
 *         description: Error interno
 */
tournamentRouter.patch('/:tournamentId/match/:id', wrapController(updateMatchResult))

//* Inscriptions
// Inscribe to tournament

/**
 * @swagger
 * /tournaments/{id}/inscriptions:
 *   post:
 *     summary: Inscribe al usuario autenticado en el torneo
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: "Pea"
 *     responses:
 *       201:
 *         description: Inscripción realizada exitosamente
 *       400:
 *         description: ID de torneo no proporcionado
 *       401:
 *         description: No autenticado
 *       409:
 *         description: Usuario ya inscripto en el torneo
 *       422:
 *         description: Torneo no encontrado
 *       500:
 *         description: Error interno
 */
tournamentRouter.post('/:id/inscriptions', authenticationMiddleware, wrapController(inscribeToTournament))
// Delete the inscription

/**
 * @swagger
 * /tournaments/{id}/inscriptions:
 *   delete:
 *     summary: Elimina la inscripción del usuario autenticado del torneo
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inscripción eliminada exitosamente
 *       400:
 *         description: ID de torneo no proporcionado
 *       401:
 *         description: No autenticado
 *       422:
 *         description: Inscripción no encontrada
 *       500:
 *         description: Error interno
 */
tournamentRouter.delete('/:id/inscriptions', authenticationMiddleware, wrapController(deleteInscription))

//* Tournament status transitions
// The owner or admin closes the inscriptions of the tournament

/**
 * @swagger
 * /tournaments/{id}/close:
 *   post:
 *     summary: Cierra las inscripciones y genera el bracket
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bracket generado exitosamente
 *       400:
 *         description: Menos de 2 inscripciones
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       409:
 *         description: El torneo no está en estado OPEN
 *       422:
 *         description: Torneo no encontrado
 *       500:
 *         description: Error interno
 */
tournamentRouter.post(
    '/:id/close',
    authenticationMiddleware,
    isOwnerOrAdminMiddleware,
    wrapController(closeInscriptions),
)


// The owner or admin starts the tournament. Bracket gets created

/**
 * @swagger
 * /tournaments/{id}/start:
 *   post:
 *     summary: Inicia el torneo
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Torneo iniciado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       409:
 *         description: El torneo no está en estado CLOSED
 *       422:
 *         description: Torneo no encontrado
 *       500:
 *         description: Error interno
 */
tournamentRouter.post(
    '/:id/start',
    authenticationMiddleware,
    isOwnerOrAdminMiddleware,
    wrapController(startTournament),
)
// The owner or admin notifies end of the tournament

/**
 * @swagger
 * /tournaments/{id}/finish:
 *   post:
 *     summary: Finaliza el torneo
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Torneo finalizado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       409:
 *         description: El torneo no está en estado RUNNING
 *       422:
 *         description: Torneo no encontrado
 *       500:
 *         description: Error interno
 */
tournamentRouter.post(
    '/:id/finish',
    authenticationMiddleware,
    isOwnerOrAdminMiddleware,
    wrapController(endTournament),
)
// The owner or admin notifies cancelation of the tournament

/**
 * @swagger
 * /tournaments/{id}/cancel:
 *   post:
 *     summary: Cancela el torneo
 *     tags: [Tournaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Torneo cancelado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       409:
 *         description: El torneo está finalizado y no puede cancelarse
 *       422:
 *         description: Torneo no encontrado
 *       500:
 *         description: Error interno
 */
tournamentRouter.post(
    '/:id/cancel',
    authenticationMiddleware,
    isOwnerOrAdminMiddleware,
    wrapController(cancelTournament),
)

export { tournamentRouter }
