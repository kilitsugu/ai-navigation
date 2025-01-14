const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function createAdmin() {
    try {
        // 生成密码哈希
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // 先删除已存在的 admin 账户
        await db.execute('DELETE FROM users WHERE username = ?', ['admin']);

        // 插入新的管理员账户
        await db.execute(`
            INSERT INTO users (username, email, password, role)
            VALUES (?, ?, ?, ?)
        `, ['admin', 'admin@example.com', hashedPassword, 'admin']);

        console.log('管理员账户创建成功！');
        console.log('用户名: admin');
        console.log('密码: admin123');
        console.log('哈希密码:', hashedPassword); // 用于调试

        process.exit(0);
    } catch (error) {
        console.error('创建管理员账户失败:', error);
        console.error('错误详情:', error.stack);
        process.exit(1);
    }
}

createAdmin(); 