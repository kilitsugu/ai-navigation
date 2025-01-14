process.env.DB_HOST = '127.0.0.1';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'kilitsugu123';
process.env.DB_DATABASE = 'ai_navigation';
process.env.JWT_SECRET = 'your_secret_key_here';
process.env.PORT = '3000';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mysql = require('mysql2/promise');
const fs = require('fs').promises;

// 添加调试信息
console.log('当前工作目录:', process.cwd());
console.log('.env 文件路径:', path.join(__dirname, '..', '.env'));
console.log('数据库配置:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? '已设置' : '未设置',
    database: process.env.DB_DATABASE
});

async function initDatabase() {
    let connection;
    try {
        // 先创建数据库连接（不指定数据库）
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        // 创建数据库
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);
        
        // 切换到指定数据库
        await connection.query(`USE ${process.env.DB_DATABASE}`);

        // 读取并执行 SQL 文件
        const sqlFile = await fs.readFile(path.join(__dirname, 'init.sql'), 'utf8');
        const statements = sqlFile.split(';').filter(stmt => stmt.trim());
        
        for (let statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }

        console.log('数据库初始化成功！');
    } catch (error) {
        console.error('数据库初始化失败:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initDatabase(); 