import { Router } from 'express'
import { deleteTournamentData, findAll, getTournamentData, createBracket } from './brackets.controller.js'

const bracketsRouter = Router()

bracketsRouter.post('/create-bracket', createBracket)
bracketsRouter.get('/tournament/:id', getTournamentData)
bracketsRouter.delete('/tournament/:id', deleteTournamentData)
bracketsRouter.get('/', findAll)

export { bracketsRouter }
