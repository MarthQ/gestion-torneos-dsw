import { Router } from 'express'
import {
    sanitizeGameTagInput,
    findAll,
    findOne,
    add,
    update,
    remove,
} from './game_tag.controller.js'

const gameTagRouter = Router()

gameTagRouter.get('/', findAll)
gameTagRouter.get('/:id', findOne)
gameTagRouter.post('/', sanitizeGameTagInput, add)
gameTagRouter.put('/:id', sanitizeGameTagInput, update)
gameTagRouter.patch('/:id', sanitizeGameTagInput, update)
gameTagRouter.delete('/:id', sanitizeGameTagInput, remove)

export { gameTagRouter }
