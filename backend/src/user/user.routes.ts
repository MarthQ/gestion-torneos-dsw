import { Router } from 'express'
import { findAll, findOne, add, update, updateByUser, remove, sendInvitation } from './user.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { wrapController } from '../utils/http-errors.utils.js'

const userRouter = Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Se recuperaron todos los usuarios
 *       501:
 *         description: Servicio no disponible
 */
userRouter.get('/', wrapController(findAll))

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Recupera un usuario específico
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       400:
 *         description: Formato de ID inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
userRouter.get('/:id', wrapController(findOne))

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualiza totalmente un usuario existente
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.put('/:id', authenticationMiddleware, wrapController(update))

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Borra un usuario existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Users]
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
 *         description: Usuario borrado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
userRouter.delete(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(remove),
)

//(ADMIN) Create user without password

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Permite crear un usuario con o sin contraseña. Si no se envía contraseña, el usuario deberá establecerla mediante el flujo de recuperación. Solo accesible para usuarios con rol de Administrador.
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos de administrador
 *       409:
 *         description: El nombre de usuario o mail ya estan en uso
 *       500:
 *         description: Error interno
 */
userRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(add))

//(ADMIN) Generate token & send mail with link to setup the password

/**
 * @swagger
 * /users/{id}/invite:
 *   get:
 *     summary: Envía un email de invitación al usuario
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: path
 *         required: false
 *         schema:
 *           type: string
 *         description: Path del frontend al que redirigir
 *     responses:
 *       200:
 *         description: Email de invitación enviado
 *       401:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
userRouter.get('/:id/invite', authenticationMiddleware, wrapController(sendInvitation))

/**
 * @swagger
 * /users/editProfile:
 *   patch:
 *     summary: Actualiza parcialmente el perfil del usuario autenticado
 *     description: Permite al usuario modificar sus propios datos (nombre, mail, ubicación, avatar).
 *                  Incluye validaciones de unicidad para el nombre y un cooldown de 3 meses
 *                  para cambios de nombre de usuario.
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de usuario (requiere cooldown si ya fue cambiado)
 *                 example: "NuevoNickname"
 *               mail:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico
 *                 example: "nuevo@mail.com"
 *               location:
 *                 type: integer
 *                 description: ID de la ubicación
 *                 example: 5
 *               avatarId:
 *                 type: string
 *                 description: ID del avatar (opcional)
 *                 example: "avatar-123"
 *             required: []
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Perfil actualizado
 *       400:
 *         description: Datos de entrada inválidos (error de validación Zod)
 *       403:
 *         description: Cooldown no terminado para cambio de nombre o nombre ya existente
 *       401:
 *         description: No autenticado
 *       409:
 *         description: El nombre de usuario ya está en uso
 *       500:
 *         description: Error interno
 */
userRouter.patch('/editProfile', authenticationMiddleware, wrapController(updateByUser))

//(ADMIN) Update user's data

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un usuario existente
 *     description: Solo accesible para usuarios con rol de Administrador.
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.patch(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(update),
)

export { userRouter }
