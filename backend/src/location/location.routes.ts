import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './location.controller.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'

const locationRouter = Router()

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Lista todas las regiones
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Se recuperaron todas las regiones
 *       501:
 *         description: Servicio no disponible
 */
locationRouter.get('/', findAll)

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Recupera una region específica
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Region encontrada
 *       400:
 *         description: Formato de ID inválido
 *       404:
 *         description: Region no encontrada
 *       500:
 *         description: Error interno
 */
locationRouter.get('/:id', findOne)

/**
 * @swagger
 * /locations:
 *   post:
 *     summary: Crea una nueva region
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
 *         description: Region creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 */
locationRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), add)

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     summary: Actualiza totalmente una region existente
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
 *         description: Region actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Region no encontrada
 */
locationRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)

/**
 * @swagger
 * /locations/{id}:
 *   patch:
 *     summary: Actualiza parcialmente una region existente
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
 *         description: Region actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Region no encontrada
 */
locationRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     summary: Borra una region existente
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
 *         description: Region borrada exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Region no encontrada
 *       500:
 *         description: Error interno
 */
locationRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), remove)

export { locationRouter }
