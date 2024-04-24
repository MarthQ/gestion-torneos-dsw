import { Router } from 'express'
import {
    sanitizeGameTypeInput,
    findAll,
    findOne,
    add,
    update,
    remove,
} from './game_type.controller.js'

const gameTypeRouter = Router()

gameTypeRouter.get('/', findAll)
gameTypeRouter.get('/:id', findOne)
gameTypeRouter.post('/', sanitizeGameTypeInput, add)
gameTypeRouter.put('/:id', sanitizeGameTypeInput, update)
gameTypeRouter.patch('/:id', sanitizeGameTypeInput, update)
gameTypeRouter.delete('/:id', sanitizeGameTypeInput, remove)

export { gameTypeRouter }
