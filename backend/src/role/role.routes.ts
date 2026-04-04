import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './role.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'

const roleRouter = Router()

roleRouter.get('/', findAll)
roleRouter.get('/:id', findOne)
roleRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), add)
roleRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)
roleRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)
roleRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), remove)

export { roleRouter }
