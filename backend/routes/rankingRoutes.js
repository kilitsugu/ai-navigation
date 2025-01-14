const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// 公开接口
router.get('/', rankingController.getRankings);
router.get('/:id', rankingController.getRankingById);

// 需要用户登录的接口
router.get('/user/favorites', auth, rankingController.getFavorites);
router.post('/user/favorites', auth, rankingController.addFavorite);
router.delete('/user/favorites/:id', auth, rankingController.removeFavorite);

// 需要管理员权限的接口
router.post('/', adminAuth, rankingController.addRanking);
router.put('/:id', adminAuth, rankingController.updateRanking);
router.delete('/:id', adminAuth, rankingController.deleteRanking);

module.exports = router; 