import { Router } from 'express'
import { checkAuthStatus, login, register, forgotPassword, setupPassword, logout } from './auth.controller.js'
import { authenticationMiddleware } from './middlewares/authentication.middleware.js'

const authRouter = Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: Registro realizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: Datos de registro actualmente en uso
 *       500:
 *         description: Error interno
 */
authRouter.post('/register', register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesion
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Se inicio la sesion correctamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error interno
 */
authRouter.post('/login', login)

/**
 * @swagger
 * /Auth/check-status:
 *   get:
 *     summary: Verifica el estado de autenticación post inicio de sesion
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: Usuario autenticado correctamente
 *       401:
 *         description: Token invalido
 *       500:
 *         description: Error interno
 */
authRouter.get('/check-status', authenticationMiddleware, checkAuthStatus)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierre de sesion
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sesion cerrada correctamente
 *       500:
 *         description: Error interno
 */
authRouter.post('/logout', logout)

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Recuperacion de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       200:
 *         description: Email de recuperación enviado
 *       401:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
authRouter.post('/forgot-password', forgotPassword)

/**
 * @swagger
 * /auth/setup-password:
 *   post:
 *     summary: Establece una nueva contraseña usando el token del email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: mailToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT recibido por email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetupPassword'
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Token no proporcionado o datos inválidos
 *       401:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
authRouter.post('/setup-password', setupPassword)

export { authRouter }
