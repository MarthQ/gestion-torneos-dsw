import { Router } from 'express'
import { findAll, searchIGDB, findOne, add, update, remove } from './game.controller.js'

const gameRouter = Router()

gameRouter.get('/search', searchIGDB)
gameRouter.get('/', findAll)
gameRouter.get('/:id', findOne)
gameRouter.post('/', add)
gameRouter.put('/:id', update)
gameRouter.patch('/:id', update)
gameRouter.delete('/:id', remove)

export { gameRouter }
