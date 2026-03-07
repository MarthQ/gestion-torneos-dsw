import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './tag.controller.js'

const tagRouter = Router()

tagRouter.get('/', findAll)
tagRouter.get('/:id', findOne)
tagRouter.post('/', add)
tagRouter.put('/:id', update)
tagRouter.patch('/:id', update)
tagRouter.delete('/:id', remove)

export { tagRouter }
