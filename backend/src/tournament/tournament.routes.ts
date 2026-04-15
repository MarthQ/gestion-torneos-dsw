import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './tournament.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { isOwnerOrAdminMiddleware } from '../auth/middlewares/isOwnerOrAdmin.middleware.js'

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
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       501:
 *         description: Servicio no disponible
 */
tournamentRouter.get('/', findAll)

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
tournamentRouter.get('/:id', findOne)

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
tournamentRouter.post('/', authenticationMiddleware, add)

/**
 * @swagger
 * /tournaments/{id}:
 *   put:
 *     summary: Actualiza un torneo existente
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
 *       404:
 *         description: Torneo no encontrado
 */
tournamentRouter.put('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, update)


tournamentRouter.patch('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, update)


tournamentRouter.delete('/:id', authenticationMiddleware, isOwnerOrAdminMiddleware, remove)



export { tournamentRouter }
