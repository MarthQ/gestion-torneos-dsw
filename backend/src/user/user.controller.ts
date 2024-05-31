import { Request, Response, NextFunction } from 'express'
import { userRepository } from './user.repository.js'
import { User } from './user.entity.js'

const repository = new userRepository()

async function sanitizeUserInput(
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
    const user = await repository.findOne({ id: req.params.id })
    if (!user) {
        return res.status(404).send({ message: 'User not found' })
    }
    res.json({ data: user })
}

async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput

    const userInput = new User(input.name, input.password, input.mail)

    const user = await repository.add(userInput)

    return res
        .status(201)
        .send({ message: 'User created succesfully', data: user })
}

async function update(req: Request, res: Response) {
    const user = await repository.update(
        req.params.id,
        req.body.sanitizedInput
    )

    if (!user) {
        return res.status(404).send({ message: 'User not found' })
    }

    return res.status(200).send({
        message: 'User updated succesfully',
        data: user,
    })
}

async function remove(req: Request, res: Response) {
    const user = await repository.delete({ id: req.params.id })

    if (!user) {
        return res.status(404).send({ message: 'User not found' })
    } else {
        return res.status(200).send({ message: 'User deleted succesfully' })
    }
}

export { sanitizeUserInput, findAll, findOne, add, update, remove }
