import { findAll, add } from '../tournament/tournament.controller.js'
import { ORM } from '../shared/db/orm.js'

jest.mock('../shared/db/orm.js', () => ({
  ORM: {
    em: {
      find: jest.fn(),
      create: jest.fn(),
      flush: jest.fn(),
    }
  }
}))

describe('Tournament Controller', () => {
  let req: any
  let res: any

  beforeEach(() => {
    req = { query: {}, body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.clearAllMocks()
  })

  it('should return all tournaments with status 200', async () => {
    const mockTournaments = [{ id: 1, name: 'Torneo Test' }]
    ;(ORM.em.find as jest.Mock).mockResolvedValue(mockTournaments)

    await findAll(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      data: mockTournaments
    }))
  })

  it('should return 404 when db throws on findAll', async () => {
  ;(ORM.em.find as jest.Mock).mockRejectedValue(new Error('DB error'))

  await findAll(req, res)

  expect(res.status).toHaveBeenCalledWith(404)
  })
  it('should return 201 when tournament is added successfully', async () => {
    const mockTournament = {
      name: 'Torneo Test',
      description: 'Descripcion',
      datetimeinit: '2026-01-01T00:00:00.000Z',
      status: 'Abierto',
      maxParticipants: 16,
      game: 1,
      location: 1,
      creator: 1,
      tags: [1, 2],
    }

    req.body = mockTournament
    ;(ORM.em.create as jest.Mock).mockReturnValue(mockTournament)
    ;(ORM.em.flush as jest.Mock).mockResolvedValue(undefined)

    await add(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      data: mockTournament
    }))
  })

  it('should return 500 when add receives invalid data', async () => {
  req.body = { name: 123 } // name debería ser string

  await add(req, res)

  expect(res.status).toHaveBeenCalledWith(500)
})
})