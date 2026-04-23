import { Router } from 'express'
import { findAll, searchIGDB, findOne, add, update, remove } from './game.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'

const gameRouter = Router()

/**
 * @swagger
 * /games/search:
 *   get:
 *     summary: Busca juegos en IGDB
 *     tags: [Games]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del juego a buscar
 *     responses:
 *       200:
 *         description: Juegos encontrados
 *       400:
 *         description: Query no proporcionado
 *       502:
 *         description: Error al conectar con IGDB
 *       500:
 *         description: Error interno
 */
gameRouter.get('/search', authenticationMiddleware, searchIGDB)

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Lista todos los juegos
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Se recuperaron todos los juegos
 *       501:
 *         description: Servicio no disponible
 */
gameRouter.get('/', findAll)

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Recupera un juego específico
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Juego encontrado
 *       400:
 *         description: Formato de ID inválido
 *       404:
 *         description: Juego no encontrado
 *       500:
 *         description: Error interno
 */
gameRouter.get('/:id', findOne)

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Crea un nuevo Juego
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Games]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       201:
 *         description: Juego creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 */
gameRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), add)

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     summary: Actualiza totalmente un Juego existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Games]
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
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: Juego actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Juego no encontrado
 */
gameRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)

/**
 * @swagger
 * /games/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un juego existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Games]
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
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: Juego actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Juego no encontrado
 */
gameRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Borra un juego existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Games]
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
 *         description: Juego borrado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Juego no encontrado
 *       500:
 *         description: Error interno
 */
gameRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), remove)

export { gameRouter }
