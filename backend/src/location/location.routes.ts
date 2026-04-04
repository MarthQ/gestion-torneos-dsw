import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './location.controller.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'

const locationRouter = Router()

locationRouter.get('/', findAll)
locationRouter.get('/:id', findOne)
locationRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), add)
locationRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)
locationRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)
locationRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), remove)

export { locationRouter }
