import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './game_type.controller.js'

const gameTypeRouter = Router()

gameTypeRouter.get('/', findAll)
gameTypeRouter.get('/:id', findOne)
gameTypeRouter.post('/', add)
gameTypeRouter.put('/:id', update)
gameTypeRouter.patch('/:id', update)
gameTypeRouter.delete('/:id', remove)

export { gameTypeRouter }
