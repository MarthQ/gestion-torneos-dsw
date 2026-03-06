import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './role.controller.js'

const roleRouter = Router()

roleRouter.get('/', findAll)
roleRouter.get('/:id', findOne)
roleRouter.post('/', add)
roleRouter.put('/:id', update)
roleRouter.patch('/:id', update)
roleRouter.delete('/:id', remove)

export { roleRouter }
