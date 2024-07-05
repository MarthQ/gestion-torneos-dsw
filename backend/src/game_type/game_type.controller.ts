import { Request, Response, NextFunction } from 'express'
import { Game_TypeRepository } from './game_type.repository.js'
import { Game_Type } from './game_type.entity.js'

const repository = new Game_TypeRepository()

async function sanitizeGameTypeInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags?.join(', '),
    }
    // Habría que hacer un chequeo de que los datos son correctos
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) delete req.body.sanitizedInput[key]
    })

    next()
}

async function findAll(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' })
}

async function findOne(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' })
}

async function add(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' })
}

async function update(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' })
}

async function remove(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' })
}

export { sanitizeGameTypeInput, findAll, findOne, add, update, remove }
