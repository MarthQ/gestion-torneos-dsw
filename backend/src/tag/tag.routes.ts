import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './tag.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { wrapController } from '../utils/http-errors.utils.js'

const tagRouter = Router()

//? Should we put default values in every documented findAll?

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Lista todos los tags
 *     tags: [Tags]
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
 *        description: Filtro por nombre de Tag
 *     responses:
 *       200:
 *         description: Se recuperaron todos los tags
 *       501:
 *         description: Servicio no disponible
 */
tagRouter.get('/', wrapController(findAll))

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Recupera un tag específico
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag encontrado
 *       400:
 *         description: Formato de ID inválido
 *       404:
 *         description: Tag no encontrado
 *       500:
 *         description: Error interno
 */
tagRouter.get('/:id', wrapController(findOne))

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Crea un nuevo tag
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Tags]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       201:
 *         description: Tag creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 */
tagRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(add))

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Actualiza totalmente un tag existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Tags]
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
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       200:
 *         description: Tag actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Tag no encontrado
 */
tagRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(update))

/**
 * @swagger
 * /tags/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un tag existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Tags]
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
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       200:
 *         description: Tag actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Tag no encontrado
 */
tagRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(update))

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Borra un tag existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Tags]
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
 *         description: Tag borrado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Tag no encontrado
 *       500:
 *         description: Error interno
 */
tagRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(remove))


export { tagRouter }
