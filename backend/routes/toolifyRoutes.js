const express = require('express');
const router = express.Router();
const toolifyController = require('../controllers/toolifyController');

// 添加一个 GET 路由用于测试
router.get('/test-crawl', async (req, res) => {
    try {
        const result = await toolifyController.crawlAndSave();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 手动触发爬虫
router.post('/crawl', async (req, res) => {
    try {
        const result = await toolifyController.crawlAndSave();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 获取榜单数据
router.get('/rankings', toolifyController.getRankings);

module.exports = router; 