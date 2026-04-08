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

const userRouter = Router()

userRouter.get('/', findAll)
userRouter.get('/:id', findOne)
userRouter.delete('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), remove)

//(ADMIN) Create user without password
userRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), add)
//(ADMIN) Generate token & send mail with link to setup the password
userRouter.get('/:id/invite', authenticationMiddleware, sendInvitation)
//(USER) Change password from "setup password page"
userRouter.patch('/password', authenticationMiddleware, changePassword)
//(USER) Generate token & send mail with link to setup the new password
userRouter.get('/change-password', authenticationMiddleware, requestResetPassword)

//(ADMIN) Update user's data
userRouter.patch('/:id', update)
userRouter.put('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)

export { userRouter }
