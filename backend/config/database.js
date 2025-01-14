const mysql = require('mysql2');
require('dotenv').config();

// 添加调试日志
console.log('Database configuration:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 测试连接
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Database connected successfully');
    connection.release();
});

module.exports = pool.promise(); 