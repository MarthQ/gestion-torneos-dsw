if (!process.env.IGDB_CLIENT_ID) throw new Error('IGDB_CLIENT_ID is not defined')
if (!process.env.IGDB_ACCESS_TOKEN) throw new Error('IGDB_ACCESS_TOKEN is not defined')
if (!process.env.DEFAULT_SALT_ROUNDS) throw new Error('DEFAULT_SALT_ROUNDS is not defined')
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')

export const env = {
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,

    igdbClientId: process.env.IGDB_CLIENT_ID,
    igdbAccessToken: process.env.IGDB_ACCESS_TOKEN,
    defaultSaltRounds: process.env.DEFAULT_SALT_ROUNDS,
    jwtSecret: process.env.JWT_SECRET,
    // Set to 'true' in production (HTTPS), 'false' in development (HTTP)
    jwtCookieSecure: process.env.JWT_COOKIE_SECURE === 'true',

    // Cookie config (4 horas en ms)
    jwtCookieMaxAge: 4 * 60 * 60 * 1000,
    jwtCookieName: 'access_token',
}
