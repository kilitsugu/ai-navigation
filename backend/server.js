const express = require('express');
const cors = require('cors');
const path = require('path');
const crawlerScheduler = require('./utils/scheduler');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors({
    origin: ['http://localhost:3000', 'https://kilitsugu.github.io'],
    credentials: true
}));
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '..', 'docs')));

// API 路由
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/rankings', require('./routes/rankingRoutes'));
app.use('/api/crawler', require('./routes/crawlerRoutes'));
app.use('/api/monitor', require('./routes/monitorRoutes'));
app.use('/api/toolify', require('./routes/toolifyRoutes'));

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || '服务器错误'
    });
});

// 启动爬虫调度器
crawlerScheduler.start().catch(console.error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 