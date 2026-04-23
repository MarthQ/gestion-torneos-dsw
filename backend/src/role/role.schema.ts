import { z } from 'zod';
import { registry } from '../shared/swagger/swagger-registry.js';

export const RoleSchema = registry.register(
    'Role',
    z.object({
        id: z
            .number()
            .gt(0)
            .optional()
            .openapi({ example: 4 }),
        name: z
            .string({ message: 'Name must be a string' })
            .openapi({ example: 'Secretary' })
    })
)