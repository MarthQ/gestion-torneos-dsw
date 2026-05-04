import { z } from 'zod';
import { registry } from '../shared/swagger/swagger-registry.js';

export const TagSchema = registry.register(
    'Tag',
    z.object({
        id: z
            .number()
            .gt(0)
            .optional()
            .openapi({ example: 20 }),
        name: z
            .string({ message: 'Name must be a string' })
            .openapi({ example: 'Arena' }),
        description: z
            .string({ message: 'Description must be a string' })
            .openapi({ example: 'Usually 3d fighters with multiple characters that relay on system mechanics more than character ones' })
    }) 

)