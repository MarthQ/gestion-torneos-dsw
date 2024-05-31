import { Request, Response, NextFunction } from 'express'
import { Game_TagRepository } from './game_tag.repository.js'
import { Game_Tag } from './game_tag.entity.js'

const repository = new Game_TagRepository()

async function sanitizeGameTagInput(
    req: Request,
    res: Response,
    next: NextFunction
) {
    req.body.sanitizedInput = {
        name: req.body.name,
    }
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
    const game_tag = await repository.findOne({ id: req.params.id })
    if (!game_tag) {
        return res.status(404).send({ message: 'Game Tag not found' })
    }
    res.json({ data: game_tag })
}

async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput

    const game_tagInput = new Game_Tag(input.name)

    const game_tag = await repository.add(game_tagInput)

    return res
        .status(201)
        .send({ message: 'Game tag created succesfully', data: game_tag })
}

async function update(req: Request, res: Response) {
    const game_tag = await repository.update(
        req.params.id,
        req.body.sanitizedInput
    )

    if (!game_tag) {
        return res.status(404).send({ message: 'Game Tag not found' })
    }

    return res.status(200).send({
        message: 'Game Tag updated succesfully',
        data: game_tag,
    })
}

async function remove(req: Request, res: Response) {
    const game_tag = await repository.delete({ id: req.params.id })

    if (!game_tag) {
        return res.status(404).send({ message: 'Game Tag not found' })
    } else {
        return res.status(200).send({ message: 'Game Tag deleted succesfully' })
    }
}

export { sanitizeGameTagInput, findAll, findOne, add, update, remove }
