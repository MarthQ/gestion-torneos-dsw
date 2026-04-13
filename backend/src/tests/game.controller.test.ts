import { update } from '../game/game.controller.js'
import { ORM } from '../shared/db/orm.js'

jest.mock('../config/env.js', () => ({
  env: {
    igdbClientId: 'mock-id',
    igdbAccessToken: 'mock-token',
  }
}))

jest.mock('../shared/db/orm.js', () => ({
  ORM: {
    em: {
      findOneOrFail: jest.fn(),
      assign: jest.fn(),
      flush: jest.fn(),
    }
  }
}))

describe('Game Controller', () => {
  let req: any
  let res: any

  beforeEach(() => {
    req = { 
      params: { id: '1' }, 
      body: {} 
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.clearAllMocks()
  })

  it('should return 500 if "name" is not a string', async () => {
    req.body = { name: 12345 }

    await update(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.stringContaining('Name must be a string'))
  })

  it('should return 500 if "igdbId" is not a number', async () => {
    req.body = { igdbId: "invalid-type" }

    await update(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.stringContaining('Description must be a number referencing IGDB DB'))
  })

  it('should return 500 if "id" in request body is 0 or less', async () => {
    req.body = { id: 0 } 

    await update(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })

  it('should succeed when providing a single valid field', async () => {
    req.body = { description: 'Updated description' }
    
    ;(ORM.em.findOneOrFail as jest.Mock).mockResolvedValue({ id: 1 })
    ;(ORM.em.flush as jest.Mock).mockResolvedValue(undefined)

    await update(req, res)

    expect(ORM.em.assign).toHaveBeenCalledWith(expect.anything(), { description: 'Updated description' })
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('should strip unauthorized fields not defined in the Schema', async () => {
    req.body = { name: 'Valid Name', maliciousField: 'injection' }
    
    ;(ORM.em.findOneOrFail as jest.Mock).mockResolvedValue({ id: 1 })

    await update(req, res)

    expect(ORM.em.assign).toHaveBeenCalledWith(expect.anything(), { name: 'Valid Name' })
    expect(ORM.em.assign).not.toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ maliciousField: 'injection' }))
    expect(res.status).toHaveBeenCalledWith(200)
  })
})