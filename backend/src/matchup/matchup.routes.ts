import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './matchup.controller.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { wrapController } from '../utils/http-errors.utils.js'

const matchupRouter = Router()

matchupRouter.get('/', wrapController(findAll))
matchupRouter.get('/:id', wrapController(findOne))
matchupRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(add))
matchupRouter.put(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(update),
)
matchupRouter.patch(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(update),
)
matchupRouter.delete(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(remove),
)

export { matchupRouter }
