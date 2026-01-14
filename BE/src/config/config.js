require('dotenv').config();

const defaultConfig = {
    dialect: 'mysql',
    define: {
        underscored: true,
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

module.exports = {
    development: {
        ...defaultConfig,
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'task_management_db',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        logging: false
    },
    test: {
        ...defaultConfig,
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME_TEST || 'task_management_db_test',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306
    },
    production: {
        ...defaultConfig,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.PORT

    }
}