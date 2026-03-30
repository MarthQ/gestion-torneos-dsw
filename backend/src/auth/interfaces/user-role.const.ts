export const USER_ROLE = {
    ADMIN: 'admin',
    USER: 'user',
} as const

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE]
