import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './tag.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { wrapController } from '../utils/http-errors.utils.js'

const tagRouter = Router()

tagRouter.get('/', wrapController(findAll))
tagRouter.get('/:id', wrapController(findOne))
tagRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(add))
tagRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(update))
tagRouter.patch(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(update),
)
tagRouter.delete(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(remove),
)

export { tagRouter }
