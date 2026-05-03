import { Router } from 'express'
import { findAll, searchIGDB, findOne, add, update, remove, findAllPaginated } from './game.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { wrapController } from '../utils/http-errors.utils.js'

const gameRouter = Router()

gameRouter.get('/search', authenticationMiddleware, wrapController(searchIGDB))
gameRouter.get('/', wrapController(findAll))
gameRouter.get('/paginated', wrapController(findAllPaginated))
gameRouter.get('/:id', wrapController(findOne))
gameRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(add))
gameRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(update))
gameRouter.patch(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(update),
)
gameRouter.delete(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(remove),
)

export { gameRouter }
