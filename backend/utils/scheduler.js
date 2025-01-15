const ToolifyCrawler = require('./crawler');
const db = require('../config/database');

class CrawlerScheduler {
    constructor() {
        this.interval = 5 * 60 * 1000; // 5分钟
        this.isRunning = false;
    }

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;

        const runCrawler = async () => {
            try {
                console.log('开始爬取数据:', new Date().toLocaleString());
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

                console.log('数据爬取完成:', new Date().toLocaleString());
            } catch (error) {
                console.error('爬虫任务失败:', error);
            }
        };

        // 立即执行一次
        await runCrawler();

        // 设置定时器
        this.timer = setInterval(runCrawler, this.interval);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.isRunning = false;
        }
    }
}

module.exports = new CrawlerScheduler(); 