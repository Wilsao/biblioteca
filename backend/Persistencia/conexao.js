import mysql from 'mysql2/promise';

export default async function conectar() {
    if (global.poolConexoes) {
        return await global.poolConexoes.getConnection();
    } else {
        const pool = mysql.createPool({
            host: 'localhost',
            user: process.env.USUARIO_BD,
            password: process.env.SENHA_BD,
            database: 'biblioteca',
            connectionLimit: 50,
            maxIdle: 30,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        global.poolConexoes = pool;
        return await global.poolConexoes.getConnection();
    }
}
