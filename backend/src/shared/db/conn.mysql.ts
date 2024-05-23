import mysql2 from 'mysql2/promise'

export const pool = mysql2.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'dsw',
    password: process.env.DB_PASSWORD || 'dsw',
    database: process.env.DB_NAME || 'ps8-gestion-torneos',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, //maximo de conecciones idles
    idleTimeout: 60000, //timeout de idles, en milisegundos
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
})