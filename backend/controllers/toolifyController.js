const ToolifyCrawler = require('../utils/crawler');
const db = require('../config/database');

const toolifyController = {
    async crawlAndSave() {
        try {
            const crawler = new ToolifyCrawler();
            const rankings = await crawler.crawl();

            // 保存到数据库
            for (const ranking of rankings) {
                await db.execute(`
                    INSERT INTO rankings (
                        title, url, summary, source, category, 
                        publish_date, visits, growth_rate, tags
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    visits = VALUES(visits),
                    growth_rate = VALUES(growth_rate),
                    updated_at = CURRENT_TIMESTAMP
                `, [
                    ranking.title,
                    ranking.url,
                    ranking.description,
                    ranking.source,
                    ranking.category,
                    ranking.publish_date,
                    ranking.visits,
                    ranking.growthRate,
                    JSON.stringify(ranking.tags)
                ]);
            }

            return {
                success: true,
                message: `成功爬取 ${rankings.length} 条数据`
            };
        } catch (error) {
            console.error('爬虫任务失败:', error);
            throw error;
        }
    },

    async getRankings(req, res) {
        try {
            const [rankings] = await db.execute(`
                SELECT * FROM rankings 
                WHERE source = 'toolify.ai'
                ORDER BY visits DESC
                LIMIT 50
            `);

            res.json({
                success: true,
                data: rankings
            });
        } catch (error) {
            console.error('获取榜单失败:', error);
            res.status(500).json({
                success: false,
                message: '获取榜单失败'
            });
        }
    }
};

module.exports = toolifyController; 