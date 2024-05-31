import { Router } from 'express'
import {
    sanitizeLocationInput,
    findAll,
    findOne,
    add,
    update,
    remove,
} from './location.controller.js'

const locationRouter = Router()

locationRouter.get('/', findAll)
locationRouter.get('/:id', findOne)
locationRouter.post('/', sanitizeLocationInput, add)
locationRouter.put('/:id', sanitizeLocationInput, update)
locationRouter.patch('/:id', sanitizeLocationInput, update)
locationRouter.delete('/:id', sanitizeLocationInput, remove)

export { locationRouter }
