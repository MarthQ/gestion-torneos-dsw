import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './location.controller.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { wrapController } from '../utils/http-errors.utils.js'

const locationRouter = Router()

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Lista todas las sedes
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Se recuperaron todas las sedes
 *       501:
 *         description: Servicio no disponible
 */
locationRouter.get('/', wrapController(findAll))

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Recupera una sede específica
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sede encontrada
 *       400:
 *         description: Formato de ID inválido
 *       404:
 *         description: Sede no encontrada
 *       500:
 *         description: Error interno
 */
locationRouter.get('/:id', wrapController(findOne))

/**
 * @swagger
 * /locations:
 *   post:
 *     summary: Crea una nueva sede
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Locations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       201:
 *         description: Sede creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 */
locationRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(add))

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     summary: Actualiza totalmente una sede existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Locations]
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
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Sede actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Sede no encontrada
 */
locationRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(update))

/**
 * @swagger
 * /locations/{id}:
 *   patch:
 *     summary: Actualiza parcialmente una sede existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Locations]
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
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Sede actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Sede no encontrada
 */
locationRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(update))

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     summary: Borra una sede existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Locations]
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
 *         description: Sede borrada exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Sede no encontrada
 *       500:
 *         description: Error interno
 */
locationRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(remove))

export { locationRouter }
