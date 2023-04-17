require('dotenv').config();

const mysqlConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_BASE,
    port: process.env.DATABASE_PORT
};

module.exports = mysqlConfig;