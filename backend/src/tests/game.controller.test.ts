import { update } from '../game/game.controller.js'
import { ORM } from '../shared/db/orm.js'

//Must implement new test for should Throw cases that were replaced by Httperror Wrapper

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

  it('should throw if "name" is not a string', async () => {
    req.body = { name: 12345 }

    await expect(update(req, res)).rejects.toThrow()
  })

  it('should throw if "igdbId" is not a number', async () => {
    req.body = { igdbId: "invalid-type" }

    await expect(update(req, res)).rejects.toThrow()
  })

  it('should throw if "id" in request body is 0 or less', async () => {
    req.body = { id: 0 } 

    await expect(update(req, res)).rejects.toThrow()
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