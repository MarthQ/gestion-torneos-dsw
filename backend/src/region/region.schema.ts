import { z } from 'zod';
import { registry } from '../shared/swagger/swagger-registry.js';

export const RegionSchema = registry.register(
    'Region',
    z.object({
        name: z
            .string({ message: 'Name must be a string' })
            .openapi({ example: 'Rosario'  })
    })
);