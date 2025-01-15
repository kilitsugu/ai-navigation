const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDatabase() {
    let connection;
    try {
        // 创建数据库连接
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

        // 修改 rankings 表的 source 字段
        await connection.query(`
            ALTER TABLE rankings 
            MODIFY COLUMN source ENUM('36kr', 'analysys', 'aliyun', 'sspai', 'itjuzi', 'toolify.ai') NOT NULL
        `);

        console.log('数据库更新成功！');
    } catch (error) {
        console.error('数据库更新失败:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

updateDatabase(); 