import { z } from 'zod';
import { registry } from '../shared/swagger/swagger-registry.js';

export const GameSchema = registry.register(
    'Game',
    z.object({
        id: z
            .number()
            .gt(0)
            .optional()
            .openapi({ example: 3 }),
        name: z
            .string({ message: 'Name must be a string' })
            .openapi({ example: 'Dissidia: Final Fantasy' }),
        description: z
            .string({ message: 'Description must be a string' })
            .openapi({ example: 'Final Fantasy based arena fighting game' }),
        imgUrl: z
            .string({ message:' ImgUrl must be a string referencing IGDB image source' })
            .openapi({ example: 'co205i' }),
        igdbId: z
            .number({ message: 'IgdbId must be a number referencing IGDB DB' })
            .openapi({ example: 391 }),
        gametype: z
            .number({ message: 'Gametype must be a number representing a gametype Id' })
            .openapi({ example: 2 })
    })
)