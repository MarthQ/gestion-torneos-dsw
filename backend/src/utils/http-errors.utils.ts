import { Response } from 'express'

export interface HttpErrorResponse {
    message: string
    statusCode: number
    errors?: any[]
}

export function handleHttpError(error: any, res: Response): Response<HttpErrorResponse> {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            message: error.message,
            statusCode: error.statusCode,
        })
    }

    if (error.name === 'ZodValidationError' || error.details) {
        const validationErrors =
            error.details?.map((e: any) => ({
                path: e.path?.join('.'),
                message: e.message,
            })) || []

        return res.status(400).json({
            message: 'Validation failed',
            statusCode: 400,
            errors: validationErrors,
        })
    }

    if (error.name === 'NotFoundError') {
        return res.status(422).json({
            message: 'Resource not found',
        })
    }

    const sqlMessage = error?.sqlMessage

    if (sqlMessage?.includes('user_name_unique')) {
        return res.status(409).json({
            message: `Name already taken`,
        })
    }
    if (sqlMessage?.includes('user_mail_unique')) {
        return res.status(409).json({
            message: `Email already taken`,
        })
    }

    if (sqlMessage?.includes('region_name_unique')) {
        return res.status(409).json({
            message: `Name already taken`,
        })
    }

    if (sqlMessage?.includes('foreign key constraint fails')) {
        return res.status(409).json({
            message: 'Invalid reference - related resource does not exist',
            statusCode: 409,
        })
    }

    if (sqlMessage?.includes('cannot delete or update a parent row')) {
        return res.status(409).json({
            message: 'Cannot delete - resource is referenced by other data',
            statusCode: 409,
        })
    }

    if (error.code === 'ECONNREFUSED' || sqlMessage?.includes('connection refused')) {
        return res.status(503).json({
            message: 'Database temporarily unavailable',
            statusCode: 503,
        })
    }

    if (error.code === 'ER_ACCESS_DENIED_ERROR' || sqlMessage?.includes('access denied')) {
        return res.status(503).json({
            message: 'Database access error',
            statusCode: 503,
        })
    }

    if (error.code === 'ETIMEDOUT' || sqlMessage?.includes('timeout')) {
        return res.status(504).json({
            message: 'Database query timeout',
            statusCode: 504,
        })
    }

    if (error.code === 'ER_DUP_ENTRY' || sqlMessage?.includes('tournament.tournament_name_unique')) {
        return res.status(504).json({
            message: 'Tournament name already taken',
            statusCode: 504,
        })
    }

    return res.status(500).json({
        message: 'Internal Server Error',
        statusCode: 500,
    })
}

export function wrapController(fn: (req: any, res: any, next?: any) => Promise<any> | any) {
    return async (req: any, res: any, next: any) => {
        try {
            await fn(req, res, next)
        } catch (error: any) {
            next(error)
        }
    }
}
