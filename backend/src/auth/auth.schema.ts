import { z } from 'zod';
import { registry } from '../shared/swagger/swagger-registry.js';


//* Validations
export const registerSchema = registry.register(
      'Register',
      z.object({
            name: z
                  .string({ message: 'Username must be a string.' })
                  .openapi({ example: 'mchiditox' }),
            password: z
                  .string({ message: 'Password must be a string.' })
                  .openapi({ example: 'testPass123' }),
            mail: z
                  .string({ message: 'Mail must be a string.' }).email({ message: 'Mail must be a valid email.' })
                  .openapi({ example: 'testemail@yahoo.com' }),
            location: z
                  .number({ message: 'Location must be a valid number.' })
                  .openapi({ example: 3 })
      })
)

export const loginSchema = registry.register(
      'Login',
      z.object({
            mail: z
                  .string({ message: 'Mail must be a string.' }).email({ message: 'Mail must be a valid email' })
                  .openapi({ example: 'testemail@yahoo.com' }),
            password: z
                  .string({ message: 'Password must be a string.' })
                  .openapi({ example: 'testPass123' })
      })
);

export const forgotPasswordSchema = registry.register(
      'ForgotPassword',
      z.object({
            mail: z.string({ message: 'Mail must be a string.' }).email({ message: 'Mail must be a valid email' }).openapi({ example: 'testemail@yahoo.com' })
      })
)

export const setupPasswordSchema = registry.register(
      'SetupPassword',
      z.object({
            password: z.string({ message: 'Password must be a string' }).min(8, 'The password has to be at least 8 characters long')
      })
)
export const setupPasswordQuerySchema = z.object({
      mailToken: z.string({ message: 'mailToken must be a string' }).min(1, 'mailToken is required')
})