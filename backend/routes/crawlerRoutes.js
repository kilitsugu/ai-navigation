const express = require('express');
const router = express.Router();
const crawlerController = require('../controllers/crawlerController');
const adminAuth = require('../middleware/adminAuth');

// 所有爬虫相关的路由都需要管理员权限
router.use(adminAuth);

// 获取爬虫任务列表
router.get('/tasks', crawlerController.getTasks);

// 启动爬虫任务
router.post('/tasks/:taskId/start', crawlerController.startTask);

// 停止爬虫任务
router.post('/tasks/:taskId/stop', crawlerController.stopTask);

// 获取任务日志
router.get('/tasks/:taskId/logs', crawlerController.getTaskLogs);

module.exports = router; 