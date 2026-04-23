import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './inscription.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'

const inscriptionRouter = Router()

/**
 * @swagger
 * /inscriptions:
 *   get:
 *     summary: Lista todas las inscripciones
 *     tags: [Inscriptions]
 *     responses:
 *       200:
 *         description: Se recuperaron todas las inscripciones
 *       501:
 *         description: Servicio no disponible
 */
inscriptionRouter.get('/', findAll)

/**
 * @swagger
 * /inscriptions/{id}:
 *   get:
 *     summary: Recupera una inscripcion específica
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inscripcion encontrada
 *       400:
 *         description: Formato de ID inválido
 *       404:
 *         description: Inscripcion no encontrada
 *       500:
 *         description: Error interno
 */
inscriptionRouter.get('/:id', findOne)

/**
 * @swagger
 * /inscriptions:
 *   post:
 *     summary: Crea una nueva inscripcion
 *     tags: [Inscriptions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inscription'
 *     responses:
 *       201:
 *         description: Inscripcion creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 */
inscriptionRouter.post('/', authenticationMiddleware, add)

/**
 * @swagger
 * /inscriptions/{id}:
 *   put:
 *     summary: Actualiza totalmente una inscripcion existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Inscriptions]
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
 *             $ref: '#/components/schemas/Inscription'
 *     responses:
 *       200:
 *         description: Inscripcion actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Inscripcion no encontrada
 */
inscriptionRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)

/**
 * @swagger
 * /inscriptions/{id}:
 *   patch:
 *     summary: Actualiza parcialmente una inscripcion existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Inscriptions]
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
 *             $ref: '#/components/schemas/Inscription'
 *     responses:
 *       200:
 *         description: Inscripcion actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Inscripcion no encontrada
 */
inscriptionRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)

/**
 * @swagger
 * /inscriptions/{id}:
 *   delete:
 *     summary: Borra una inscripcion existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Inscriptions]
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
 *         description: Inscripcion borrada exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Inscripcion no encontrada
 *       500:
 *         description: Error interno
 */
inscriptionRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), remove)

export { inscriptionRouter }
