import { findAll, add } from '../tournament/tournament.controller.js'
import { TournamentStatus } from '../shared/interfaces/status.js'
import { TournamentTypeEnum } from '../shared/interfaces/tournamentType.js';
import { MikroOrmDatabase } from '../bracket/brackets-mikro-db.js'
import { BracketsManager } from 'brackets-manager'
import { ORM } from '../shared/db/orm.js'


jest.mock('../bracket/brackets-mikro-db.js', () => ({
  MikroOrmDatabase: jest.fn().mockImplementation(() => ({}))
}))

jest.mock('brackets-manager', () => ({
  BracketsManager: jest.fn().mockImplementation(() => ({
    delete: { tournament: jest.fn() },
    get: { tournamentData: jest.fn() },
    create: { stage: jest.fn() },
    update: { match: jest.fn() }
  }))
}))

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
    ;(ORM.em.findAndCount as jest.Mock).mockResolvedValue([mockTournaments, 1])

    await findAll(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      data: mockTournaments
    }))
  })

  //Kind of deprecated due to HttpError branch error handling
  it('should throw when db throws on findAll', async () => {
    ;(ORM.em.findAndCount as jest.Mock).mockRejectedValue(new Error('DB error'))

    await expect(findAll(req, res)).rejects.toThrow('DB error')
  })
  it('should return 201 when tournament is added successfully', async () => {
    const mockTournament = {
      name: 'Torneo Test',
      description: 'Descripcion',
      datetimeinit: '2026-01-01T00:00:00.000Z',
      status: TournamentStatus.OPEN,
      maxParticipants: 16,
      game: 1,
      location: 1,
      region: 1,
      creator: 1,
      tags: [1, 2],
      type: TournamentTypeEnum.DOUBLE_ELIM
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
  req.body = { name: 123 } // name should be a string

  await expect(add(req, res)).rejects.toThrow()

})
})