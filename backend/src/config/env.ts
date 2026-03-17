if (!process.env.IGDB_CLIENT_ID) throw new Error('IGDB_CLIENT_ID is not defined')
if (!process.env.IGDB_ACCESS_TOKEN) throw new Error('IGDB_ACCESS_TOKEN is not defined')

export const env = {
    igdbClientId: process.env.IGDB_CLIENT_ID,
    igdbAccessToken: process.env.IGDB_ACCESS_TOKEN,
}
