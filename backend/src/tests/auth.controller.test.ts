import { login, register } from '../auth/auth.controller.js'
import { ORM } from '../shared/db/orm.js'

jest.mock('../config/env.js', () => ({
  env: {
    jwtCookieName: 'test-cookie',
    jwtCookieSecure: false,
    jwtCookieMaxAge: 3600,
    defaultSaltRounds: 10,
  }
}))

jest.mock('../shared/db/orm.js', () => ({
  ORM: {
    em: {
      findOneOrFail: jest.fn(),
      create: jest.fn(),
      persistAndFlush: jest.fn(),
    }
  }
}))

jest.mock('../shared/auth/jwt.utils.js', () => ({
  JWTUtils: {
    getJWT: jest.fn().mockReturnValue('mock-token'),
  }
}))

jest.mock('bcrypt', () => ({
  compareSync: jest.fn().mockReturnValue(true),
  hashSync: jest.fn().mockReturnValue('hashed-password'),
}))

describe('Auth Controller', () => {
  let req: any
  let res: any

  beforeEach(() => {
    req = { body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
    jest.clearAllMocks()
  })

  describe('Login Validation', () => {
    it('should return 400 if mail is not a valid email format', async () => {
      req.body = { mail: 'notNicole', password: '444' }

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid login request'
      }))
    })

    it('should return 400 if mail is missing', async () => {
      req.body = { password: '123' }

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should proceed if login data is valid', async () => {
      req.body = { mail: 'test@example.com', password: 'securePassword' }
      
      ;(ORM.em.findOneOrFail as jest.Mock).mockResolvedValue({
        id: 1,
        mail: 'test@example.com',
        password: 'hashed-password',
        role: { id: 1 },
        location: { id: 1 }
      })

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Register Validation', () => {
    it('should return 400 if location is not a number', async () => {
      req.body = {
        name: 'Not nicole',
        mail: 'NotNicole@example.com',
        password: 'solojuegojohnny123',
        location: 'aguantelarenga'
      }

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should return 400 if name is missing', async () => {
      req.body = {
        mail: 'Nicole@example.com',
        password: 'solojuegoaxl123',
        location: 1
      }

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should return 400 if email is invalid', async () => {
      req.body = {
        name: 'Nicole',
        mail: 'Nicole-email',
        password: 'solojuegoABA',
        location: 1
      }

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should proceed if register data is valid', async () => {
      req.body = {
        name: 'Nicole',
        mail: 'Nicole@example.com',
        password: 'nojuegoaxl123',
        location: 1
      }

      ;(ORM.em.findOneOrFail as jest.Mock).mockResolvedValue({ id: 1, name: 'USER' })
      ;(ORM.em.create as jest.Mock).mockReturnValue({ id: 1, ...req.body })

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
    })
  })
})