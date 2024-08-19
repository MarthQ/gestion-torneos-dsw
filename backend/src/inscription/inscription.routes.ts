import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './inscription.controller.js'

const inscriptionRouter = Router()

inscriptionRouter.get('/', findAll)
inscriptionRouter.get('/:id', findOne)
inscriptionRouter.post('/', add)
inscriptionRouter.put('/:id', update)
inscriptionRouter.patch('/:id', update)
inscriptionRouter.delete('/:id', remove)

export { inscriptionRouter }
