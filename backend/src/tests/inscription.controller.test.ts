import { findAll, add } from '../inscription/inscription.controller.js'
import { ORM } from '../shared/db/orm.js'

jest.mock('../shared/db/orm.js', () => ({
  ORM: {
    em: {
      find: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      flush: jest.fn(),
    }
  }
}))

describe('Inscription Controller', () => {
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

  it('should return all inscriptions with status 200', async () => {
    const mockInscriptions = [{ id: 1, nickname: 'player1' }]
    ;(ORM.em.find as jest.Mock).mockResolvedValue(mockInscriptions)

    await findAll(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      data: mockInscriptions
    }))
  })

  it('should return 500 when db throws on findAll', async () => {
    ;(ORM.em.find as jest.Mock).mockRejectedValue(new Error('DB error'))

    await findAll(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })

  it('should return 201 when inscription is added successfully', async () => {
  const mockInscription = {
    id: 1,
    nickname: 'player1',
    inscriptionDate: '2024-01-01T00:00:00.000Z',
    points: 0,
    tournament: 1,
    user: 1,
  }

  req.body = mockInscription
  ;(ORM.em.create as jest.Mock).mockReturnValue(mockInscription)
  ;(ORM.em.flush as jest.Mock).mockResolvedValue(undefined)

  await add(req, res)

  expect(res.status).toHaveBeenCalledWith(201)
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    data: mockInscription
  }))
})

it('should return 500 when add receives invalid data', async () => {
  req.body = { nickname: 123 } // nickname debería ser string

  await add(req, res)

  expect(res.status).toHaveBeenCalledWith(500)
})
})