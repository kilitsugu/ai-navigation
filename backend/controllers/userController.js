const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
    // 用户注册
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // 检查用户是否已存在
            const [existingUsers] = await db.execute(
                'SELECT * FROM users WHERE username = ? OR email = ?',
                [username, email]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: '用户名或邮箱已存在' });
            }

            // 加密密码
            const hashedPassword = await bcrypt.hash(password, 10);

            // 创建新用户
            const [result] = await db.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, 'user']
            );

            res.status(201).json({
                message: '注册成功',
                userId: result.insertId
            });
        } catch (error) {
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 用户登录
    async login(req, res) {
        try {
            const { username, password } = req.body;
            console.log('Login attempt:', { username, password });

            // 查找用户
            const [users] = await db.execute(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );

            console.log('Found users:', users);

            if (users.length === 0) {
                return res.status(401).json({ message: '用户名或密码错误' });
            }

            const user = users[0];
            console.log('User found:', { 
                id: user.id, 
                username: user.username, 
                role: user.role,
                storedPassword: user.password 
            });

            // 验证密码
            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log('Password comparison:', {
                provided: password,
                stored: user.password,
                isValid: isValidPassword
            });

            if (!isValidPassword) {
                return res.status(401).json({ message: '用户名或密码错误' });
            }

            // 生成 JWT token
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: '登录成功',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 获取用户信息
    async getProfile(req, res) {
        try {
            const [users] = await db.execute(
                'SELECT id, username, email, role FROM users WHERE id = ?',
                [req.user.id]
            );

            if (users.length === 0) {
                return res.status(404).json({ message: '用户不存在' });
            }

            res.json(users[0]);
        } catch (error) {
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 更新用户信息
    async updateProfile(req, res) {
        try {
            const { email } = req.body;

            await db.execute(
                'UPDATE users SET email = ? WHERE id = ?',
                [email, req.user.id]
            );

            res.json({ message: '更新成功' });
        } catch (error) {
            res.status(500).json({ message: '服务器错误' });
        }
    }
};

module.exports = userController; 