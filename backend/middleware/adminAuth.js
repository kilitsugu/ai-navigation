const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: '请先登录' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: '需要管理员权限' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: '认证失败' });
    }
};

module.exports = adminAuth; 