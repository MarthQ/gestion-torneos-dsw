import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './game.controller.js'

const gameRouter = Router()

gameRouter.get('/', findAll)
gameRouter.get('/:id', findOne)
gameRouter.post('/', add)
gameRouter.put('/:id', update)
gameRouter.patch('/:id', update)
gameRouter.delete('/:id', remove)

export { gameRouter }
