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
        return res.status(401).json({
            message: 'Unauthorized credentials',
        })
    }

    if (error.sqlMessage.includes('user_name_unique')) {
        return res.status(409).json({
            message: `Name already taken`,
        })
    }
    if (error.sqlMessage.includes('user_mail_unique')) {
        return res.status(409).json({
            message: `Email already taken`,
        })
    }

    if (error.sqlMessage.includes('region_name_unique')) {
        return res.status(409).json({
            message: `Name already taken`,
        })
    }

    return res.status(500).json({
        message: 'Internal Server Error',
        statusCode: 500,
    })
}
