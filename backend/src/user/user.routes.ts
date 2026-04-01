import { Router } from 'express'
import {
    findAll,
    findOne,
    add,
    update,
    remove,
    sendInvitation,
    setupPassword,
    changePassword,
    forgotPassword,
    requestResetPassword,
} from './user.controller.js'
import { authenticationMiddleware } from '../auth/middlewares/authentication.middleware.js'
import { authorizeMiddleware } from '../auth/middlewares/authorize.middleware.js'
import { USER_ROLE } from '../auth/interfaces/user-role.const.js'

const userRouter = Router()

userRouter.get('/', findAll)
userRouter.get('/:id', findOne)
userRouter.put('/:id', update)
userRouter.delete('/:id', remove)

//TODO (ADMIN) Create user without password
userRouter.post('/', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), add)
//TODO (ADMIN) Generate token & send mail with link to setup the password
userRouter.post('/:id/invite', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), sendInvitation)
//TODO (USER) Setup password using the link received by email
userRouter.post('/setup-password', setupPassword)
//TODO (USER) Change password from "setup password page"
userRouter.patch('/password', authenticationMiddleware, changePassword)
//TODO (USER) Generate token & send mail with link to setup the new password
userRouter.post('/change-password', authenticationMiddleware, requestResetPassword)
//TODO (USER) Reset password from "Forgot your password?"
userRouter.post('/forgot-password', forgotPassword)
//TODO (ADMIN) Update user's data
userRouter.patch('/:id', authenticationMiddleware, authorizeMiddleware(USER_ROLE.ADMIN), update)

export { userRouter }
