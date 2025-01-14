const db = require('../config/database');

const rankingController = {
    // 获取榜单列表
    async getRankings(req, res) {
        try {
            const { category, source, search, page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;
            
            let query = 'SELECT * FROM rankings WHERE 1=1';
            const params = [];
            
            if (search) {
                query += ' AND (title LIKE ? OR summary LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }
            
            if (category) {
                query += ' AND category = ?';
                params.push(category);
            }
            
            if (source) {
                query += ' AND source = ?';
                params.push(source);
            }
            
            query += ' ORDER BY publish_date DESC LIMIT ? OFFSET ?';
            params.push(Number(limit), offset);

            const [rankings] = await db.execute(query, params);
            const [total] = await db.execute('SELECT COUNT(*) as count FROM rankings', []);

            res.json({
                data: rankings,
                pagination: {
                    total: total[0].count,
                    current_page: Number(page),
                    per_page: Number(limit)
                }
            });
        } catch (error) {
            console.error('获取榜单列表失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 获取单个榜单详情
    async getRankingById(req, res) {
        try {
            const [rankings] = await db.execute(
                'SELECT * FROM rankings WHERE id = ?',
                [req.params.id]
            );

            if (rankings.length === 0) {
                return res.status(404).json({ message: '榜单不存在' });
            }

            res.json(rankings[0]);
        } catch (error) {
            console.error('获取榜单详情失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 获取用户收藏的榜单
    async getFavorites(req, res) {
        try {
            const [favorites] = await db.execute(`
                SELECT r.* 
                FROM rankings r
                JOIN favorites f ON r.id = f.ranking_id
                WHERE f.user_id = ?
                ORDER BY f.created_at DESC
            `, [req.user.id]);

            res.json(favorites);
        } catch (error) {
            console.error('获取收藏榜单失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 添加收藏
    async addFavorite(req, res) {
        try {
            const { rankingId } = req.body;

            // 检查榜单是否存在
            const [rankings] = await db.execute(
                'SELECT id FROM rankings WHERE id = ?',
                [rankingId]
            );

            if (rankings.length === 0) {
                return res.status(404).json({ message: '榜单不存在' });
            }

            // 添加收藏
            await db.execute(
                'INSERT INTO favorites (user_id, ranking_id) VALUES (?, ?)',
                [req.user.id, rankingId]
            );

            res.json({ message: '收藏成功' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: '已经收藏过了' });
            }
            console.error('添加收藏失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 取消收藏
    async removeFavorite(req, res) {
        try {
            const result = await db.execute(
                'DELETE FROM favorites WHERE user_id = ? AND ranking_id = ?',
                [req.user.id, req.params.id]
            );

            if (result[0].affectedRows === 0) {
                return res.status(404).json({ message: '收藏不存在' });
            }

            res.json({ message: '取消收藏成功' });
        } catch (error) {
            console.error('取消收藏失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 管理员：添加榜单
    async addRanking(req, res) {
        try {
            const { title, source, url, summary, publish_date, category } = req.body;

            const [result] = await db.execute(`
                INSERT INTO rankings (title, source, url, summary, publish_date, category)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [title, source, url, summary, publish_date, category]);

            res.status(201).json({
                message: '添加成功',
                rankingId: result.insertId
            });
        } catch (error) {
            console.error('添加榜单失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 管理员：更新榜单
    async updateRanking(req, res) {
        try {
            const { title, source, url, summary, publish_date, category } = req.body;

            const [result] = await db.execute(`
                UPDATE rankings 
                SET title = ?, source = ?, url = ?, summary = ?, 
                    publish_date = ?, category = ?
                WHERE id = ?
            `, [title, source, url, summary, publish_date, category, req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: '榜单不存在' });
            }

            res.json({ message: '更新成功' });
        } catch (error) {
            console.error('更新榜单失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 管理员：删除榜单
    async deleteRanking(req, res) {
        try {
            const [result] = await db.execute(
                'DELETE FROM rankings WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: '榜单不存在' });
            }

            res.json({ message: '删除成功' });
        } catch (error) {
            console.error('删除榜单失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    }
};

module.exports = rankingController; 