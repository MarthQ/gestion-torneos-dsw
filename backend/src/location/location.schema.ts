import { z } from 'zod';
import { registry } from '../shared/swagger/swagger-registry.js';

export const LocationSchema = registry.register(
    'Location',
    z.object({
        id: z
            .number()
            .gt(0)
            .optional()
            .openapi({ example: 55 }),
        name: z
            .string({ message: 'Name must be a string' })
            .openapi({ example: 'Racoon City' })
    })
);