import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './matchup.controller.js'

const matchupRouter = Router()

matchupRouter.get('/', findAll)
matchupRouter.get('/:id', findOne)
matchupRouter.post('/', add)
matchupRouter.put('/:id', update)
matchupRouter.patch('/:id', update)
matchupRouter.delete('/:id', remove)

export { matchupRouter }
