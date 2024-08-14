import { Request, Response} from 'express'
import { Inscription } from './inscription.entity.js'
import { ORM } from '../shared/db/orm.js'

const em = ORM.em

async function findAll(req: Request, res: Response) {
    try {
        const Inscriptions = await em.find(Inscription, {}, { populate: ['user', 'tournament'] })
        res.status(200).json({
            message: 'Found all inscriptions',
            data: Inscriptions,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const inscription = await em.findOneOrFail(Inscription, {id}, { populate: ['user', 'tournament'] })
        res.status(200).json({message: 'Found inscription', data: inscription})
    }catch(error: any){
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request, res: Response) {
    try{
        const inscription = em.create(Inscription,req.body)
        await em.flush()
        res.status(201).json({message: 'Inscription added', data: inscription}
        )
    }catch(error: any){
        res.status(500).json({message: error.message})
    }
}
async function update(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const inscription = em.getReference(Inscription, id)
        em.assign(inscription,req.body)
        await em.flush()
        res.status(200).json({message: 'Inscription updated'})
    }
    catch(error:any){
    res.status(500).json(error.message)
    }
}

async function remove(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const inscription = em.getReference(Inscription, id)
        await em.removeAndFlush(inscription)
        res.status(200).send({message: 'Inscription deleted'})
    }catch(error:any){
        res.status(500).json({message: error.message})
    }
}

export { findAll, findOne, add, update, remove }
