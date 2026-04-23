import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './role.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'

const roleRouter = Router()

//? Should we put default values in every documented findAll?

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Lista todos los roles
 *     tags: [Roles]
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 1
 *        description: Numero de pagina a ver
 *      - in: query
 *        name: pageSize
 *        schema:
 *          type: integer
 *        description: Tamaño de pagina
 *      - in: query
 *        name: query
 *        schema:
 *          type: string
 *        description: Filtro por nombre de rol
 *     responses:
 *       200:
 *         description: Se recuperaron todos los roles
 *       501:
 *         description: Servicio no disponible
 */
roleRouter.get('/', findAll)

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Recupera un rol específico
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol encontrado
 *       400:
 *         description: Formato de ID inválido
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error interno
 */
roleRouter.get('/:id', findOne)

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crea un nuevo rol
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Roles]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 */
roleRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), add)

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Actualiza totalmente un rol existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Roles]
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
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Rol no encontrado
 */
roleRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)

/**
 * @swagger
 * /roles/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un rol existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Roles]
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
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Rol no encontrado
 */
roleRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Borra un rol existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Roles]
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
 *         description: Rol borrado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error interno
 */
roleRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), remove)

export { roleRouter }
