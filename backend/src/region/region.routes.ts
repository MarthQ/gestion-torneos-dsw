import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './region.controller.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { wrapController } from '../utils/http-errors.utils.js'

const regionRouter = Router()

/**
 * @swagger
 * /regions:
 *   get:
 *     summary: Lista todas las regiones
 *     tags: [Regions]
 *     responses:
 *       200:
 *         description: Se recuperaron todas las regiones
 *       501:
 *         description: Servicio no disponible
 */
regionRouter.get('/', wrapController(findAll))

/**
 * @swagger
 * /regions/{id}:
 *   get:
 *     summary: Recupera una region específica
 *     tags: [Regions]
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
regionRouter.get('/:id', wrapController(findOne))

/**
 * @swagger
 * /regions:
 *   post:
 *     summary: Crea una nueva region
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Regions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Region'
 *     responses:
 *       201:
 *         description: Region creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       409:
 *         description: El nombre de la región ya está en uso
 */
regionRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(add))

/**
 * @swagger
 * /regions/{id}:
 *   put:
 *     summary: Actualiza totalmente una region existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Regions]
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
 *             $ref: '#/components/schemas/Region'
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
regionRouter.put(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(update),
)

/**
 * @swagger
 * /regions/{id}:
 *   patch:
 *     summary: Actualiza parcialmente una region existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Regions]
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
 *             $ref: '#/components/schemas/Region'
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
regionRouter.patch(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(update),
)

/**
 * @swagger
 * /regions/{id}:
 *   delete:
 *     summary: Borra una region existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Regions]
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
regionRouter.delete(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(remove),
)

export { regionRouter }
