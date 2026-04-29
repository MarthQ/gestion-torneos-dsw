import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './inscription.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { wrapController } from '../utils/http-errors.utils.js'

const inscriptionRouter = Router()

inscriptionRouter.get('/', wrapController(findAll))
inscriptionRouter.get('/:id', wrapController(findOne))
inscriptionRouter.post('/', authenticationMiddleware, wrapController(add))
inscriptionRouter.put(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(update),
)
inscriptionRouter.patch(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(update),
)
inscriptionRouter.delete(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(remove),
)

export { inscriptionRouter }
