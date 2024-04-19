import express, { NextFunction, Request, Response } from 'express'
import { Game_Type } from './game_type.js'

const app = express()
app.use(express.json())

const game_types = [
  new Game_Type(
    'Classic Fighter',
    'One-on-one battles between distinct characters, each with their own unique moves and abilities.',
    ['SF', 'Fighter', 'KOF', '1v1'],
    "8d47c07a-769f-433b-9830-5fb881156d81"
  )
]

function sanitizeCharacterInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags
  }
  // Habría que hacer un chequeo de que los datos son correctos
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if(req.body.sanitizedInput[key] === undefined)  
      delete  req.body.sanitizedInput[key]
  })

  next()
}

app.get('/api/game-types', (req, res) => {
  res.json({data: game_types})
})

app.get('/api/game-types/:id', (req, res) => {
  const game_type = game_types.find((game_type) => game_type.id===req.params.id)
  if(!game_type) {
    res.status(404).send({message:'Game Type not found'})
  }
  res.json({data: game_type})
})

app.post('/api/game-types', sanitizeCharacterInput, (req, res) => {
  const input = req.body.sanitizedInput

  const game_type = new Game_Type(
    input.name, 
    input.description, 
    input.tags
  )

  game_types.push(game_type)

  res.status(201).send({message:'Game type created succesfully', data:game_type})
})

app.put('/api/game-types/:id', sanitizeCharacterInput, (req, res) => {
  const game_typeIdx = game_types.findIndex((game_type) => game_type.id===req.params.id)

  if(game_typeIdx === -1) {
    res.status(404).send({message:'Game type not found'})
  }

  game_types[game_typeIdx] = {...game_types[game_typeIdx], ...req.body.sanitizedInput}

  res.status(200).send({message:'Game Type updated succesfully', data:game_types[game_typeIdx]})
})

app.patch('/api/game-types/:id', sanitizeCharacterInput, (req, res) => {
  const game_typeIdx = game_types.findIndex((game_type) => game_type.id===req.params.id)

  if(game_typeIdx === -1) {
    res.status(404).send({message:'Game type not found'})
  }

  game_types[game_typeIdx] = {...game_types[game_typeIdx], ...req.body.sanitizedInput}

  res.status(200).send({message:'Game Type updated succesfully', data:game_types[game_typeIdx]})
})

app.delete('/api/game-types/:id', (req, res) => {
  const game_typeIdx = game_types.findIndex((game_type) => game_type.id===req.params.id)

  if(game_typeIdx === -1) {
    res.status(404).send({message:'Game Type not found'})
  } else {
    game_types.splice(game_typeIdx, 1)

    res.status(200).send({message:'Game Type deleted succesfully'})
  }
})

app.listen(3000, () => {
  console.log('Server running on https://localhost:3000/')
})