const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务 - 让 Express 提供前端文件
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API 路由
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/rankings', require('./routes/rankingRoutes'));
app.use('/api/crawler', require('./routes/crawlerRoutes'));
app.use('/api/monitor', require('./routes/monitorRoutes'));

// 所有其他请求都返回 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: '服务器错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 