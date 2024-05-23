import { Request, Response, NextFunction } from 'express'
import { Game_TypeRepository } from './game_type.repository.js'
import { Game_Type } from './game_type.entity.js'

const repository = new Game_TypeRepository()

async function sanitizeGameTypeInput(
    req: Request,
    res: Response,
    next: NextFunction
) {
    req.body.sanitizedInput = {
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
    }
    // Habría que hacer un chequeo de que los datos son correctos
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined)
            delete req.body.sanitizedInput[key]
    })

    next()
}

async function findAll(req: Request, res: Response) {
    res.json({ data: await repository.findAll() })
}

async function findOne(req: Request, res: Response) {
    const game_type = await repository.findOne({ id: req.params.id })
    if (!game_type) {
        return res.status(404).send({ message: 'Game Type not found' })
    }
    res.json({ data: game_type })
}

async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput

    const game_typeInput = new Game_Type(
        input.name,
        input.description,
        input.tags
    )

    const game_type = await repository.add(game_typeInput)

    return res
        .status(201)
        .send({ message: 'Game type created succesfully', data: game_type })
}

async function update(req: Request, res: Response) {
    req.body.sanitizedInput.id = req.params.id
    const game_type = await repository.update(req.body.sanitizedInput)

    if (!game_type) {
        return res.status(404).send({ message: 'Game Type not found' })
    }

    return res.status(200).send({
        message: 'Game Type updated succesfully',
        data: game_type,
    })
}

async function remove(req: Request, res: Response) {
    const game_type = await repository.delete({ id: req.params.id })

    if (!game_type) {
        return res.status(404).send({ message: 'Game Type not found' })
    } else {
        return res
            .status(200)
            .send({ message: 'Game Type deleted succesfully' })
    }
}

export { sanitizeGameTypeInput, findAll, findOne, add, update, remove }
