import { z } from 'zod';
import { registry } from '../shared/swagger/swagger-registry.js';

export const InscriptionSchema = registry.register(
    'Inscription',
    z.object({
        id: z
            .number()
            .gt(0)
            .optional()
            .openapi({ example: 3 }),
        nickname: z
            .string({ message: 'Nickname must be a string' })
            .openapi({ example: 'Pea' }),
        inscriptionDate: z
            .string().datetime({ message: 'The inscription date must be a date' })
            .openapi({ example: '2026-06-15T15:00:00.000Z' }),
        points: z
            .number({ message: 'Points must be a number' })
            .openapi({ example: 15 }),
        tournament: z
            .number({ message: 'Tournament must be a number representing a tournament ID' })
            .openapi({ example: 1 }),
        user: z
            .number({ message: 'User must be a number representing a user ID' })
            .openapi({ example: 1 })
    })
);