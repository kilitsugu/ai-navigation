const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');
const adminAuth = require('../middleware/adminAuth');

// 所有监控相关的路由都需要管理员权限
router.use(adminAuth);

// 获取系统状态
router.get('/system', monitorController.getSystemStatus);

// 获取统计数据
router.get('/statistics', monitorController.getStatistics);

// 获取爬虫状态
router.get('/crawler', monitorController.getCrawlerStatus);

// 获取系统日志
router.get('/logs', monitorController.getSystemLogs);

module.exports = router; 