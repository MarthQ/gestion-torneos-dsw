import { z } from 'zod';
import { registry } from '../shared/swagger/swagger-registry.js';
import {  TournamentStatus  } from '../shared/interfaces/status.js'
import { TournamentTypeEnum } from '../shared/interfaces/tournamentType.js';

export const TournamentSchema = registry.register(
    'Tournament',
    z.object({
        //? No longer part of Schema in develop?
        // id: z
        //     .number()
        //     .gt(0)
        //     .optional()
        //     .openapi({ example: 1 }),
        
        name: z
            .string({ message: 'Name must be a string' })
            .openapi({ example: 'Double Overdrive Team OPERA' }),
        
        description: z
            .string({ message: 'Description must be a string' })
            .openapi({ example: 'Torneo de comunidad hosteado por RebelJ' }),
        
        datetimeinit: z.coerce
            .date({ message: 'Date time must be a date' })
            .openapi({ example: '2026-06-15T10:00:00Z' }),
        
        status: z
            .nativeEnum(TournamentStatus, { message: 'Status must be a string' }).optional()
            .openapi({ example: TournamentStatus.OPEN }),
        
        maxParticipants: z
            .number({ message: 'The maximum number of participants should be a number' })
            .gt(1, { message: 'The maximum number of participants should be greater than 1' })
            .openapi({ example: 32 }),
        
        game: z
            .number({ message: 'Game must be a number representing a game id' })
            .openapi({ example: 5 }),
        
        location: z
            .number({ message: 'Location must be a number representing a location id' })
            .openapi({ example: 2 }),
        
        region: z
            .number({ message: 'Region must be a number represeting a region id' })
            .openapi({ example: 15 }),
    
        creator: z
            .number({ message: 'Creator must be a number representing a user id' })
            .openapi({ example: 4 }),
        
        tags: z
            .array(z.number())
            .openapi({ example: [1, 2, 5] }),

        type: z
            .nativeEnum(TournamentTypeEnum, { message: 'Type must be one of the permitted' })
            .openapi({ example: TournamentTypeEnum.DOUBLE_ELIM })
    })
);