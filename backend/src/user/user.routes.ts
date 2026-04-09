import { Router } from 'express'
import {
    findAll,
    findOne,
    add,
    update,
    remove,
    sendInvitation,
    changePassword,
    requestResetPassword,
} from './user.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'
import { wrapController } from '../utils/http-errors.utils.js'

const userRouter = Router()

userRouter.get('/', wrapController(findAll))
userRouter.get('/:id', wrapController(findOne))
userRouter.put('/:id', authenticationMiddleware, wrapController(update))
userRouter.delete(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(remove),
)

//(ADMIN) Create user without password
userRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), wrapController(add))
//(ADMIN) Generate token & send mail with link to setup the password
userRouter.get('/:id/invite', authenticationMiddleware, wrapController(sendInvitation))
//(USER) Change password from "setup password page"
userRouter.patch('/password', authenticationMiddleware, wrapController(changePassword))
//(USER) Generate token & send mail with link to setup the new password
userRouter.get('/change-password', authenticationMiddleware, wrapController(requestResetPassword))

//(ADMIN) Update user's data
userRouter.patch(
    '/:id',
    authenticationMiddleware,
    authorizeMiddleware(USER_ROLE.ADMIN),
    wrapController(update),
)

export { userRouter }
