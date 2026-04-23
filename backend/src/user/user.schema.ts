import { z } from 'zod';
import { registry } from '../shared/swagger/swagger-registry.js';

export const UserSchema = registry.register(
    'User',
    z.object({
        id: z
            .number()
            .gt(0)
            .optional()
            .openapi({ example: 3 }),
        name: z
            .string({ message: 'Name must be a string' })
            .openapi({ example: 'Jimbo' }),
        password: z
            .string({ message: 'Password must be a string' }).optional()
            .openapi({ example: 'noMegustaLafrutilla' }),
        mail: z
            .string({ message: 'Mail must be a string' })
            .openapi({ example: 'jimbo@hotmail.com' }),
        location: z
            .number({ message: 'Location must be a number representing a location ID' })
            .openapi({ example: 5 }),
        role: z
            .number({ message: 'Role must be a number representing a role ID' })
            .openapi({ example: 2 })
    })
);

export const changePasswordSchema = registry.register(
    'ChangePassword',
    z.object({
        password: z.string().min(8).openapi({ example: 'noMegustaLaSandia' })
    })
);