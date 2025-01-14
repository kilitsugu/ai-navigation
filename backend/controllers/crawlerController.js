const db = require('../config/database');
const axios = require('axios');
const cheerio = require('cheerio');

const crawlerController = {
    // 获取爬虫任务列表
    async getTasks(req, res) {
        try {
            const [tasks] = await db.execute('SELECT * FROM crawler_tasks ORDER BY created_at DESC');
            res.json({ data: tasks });
        } catch (error) {
            console.error('获取爬虫任务失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 启动爬虫任务
    async startTask(req, res) {
        const { taskId } = req.params;
        try {
            // 更新任务状态
            await db.execute(
                'UPDATE crawler_tasks SET status = ?, last_run = NOW() WHERE id = ?',
                ['running', taskId]
            );

            // 异步执行爬虫
            this.runCrawler(taskId);

            res.json({ message: '任务已启动' });
        } catch (error) {
            console.error('启动爬虫任务失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 停止爬虫任务
    async stopTask(req, res) {
        const { taskId } = req.params;
        try {
            await db.execute(
                'UPDATE crawler_tasks SET status = ? WHERE id = ?',
                ['pending', taskId]
            );
            res.json({ message: '任务已停止' });
        } catch (error) {
            console.error('停止爬虫任务失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 获取任务日志
    async getTaskLogs(req, res) {
        const { taskId } = req.params;
        try {
            const [logs] = await db.execute(
                'SELECT * FROM crawler_logs WHERE task_id = ? ORDER BY created_at DESC LIMIT 100',
                [taskId]
            );
            res.json({ data: logs });
        } catch (error) {
            console.error('获取任务日志失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 执行爬虫任务
    async runCrawler(taskId) {
        try {
            // 获取任务信息
            const [tasks] = await db.execute('SELECT * FROM crawler_tasks WHERE id = ?', [taskId]);
            const task = tasks[0];

            // 根据不同来源执行不同的爬虫逻辑
            switch (task.source) {
                case '36kr':
                    await this.crawl36Kr(task);
                    break;
                case 'analysys':
                    await this.crawlAnalysys(task);
                    break;
                case 'aliyun':
                    await this.crawlAliyun(task);
                    break;
                case 'sspai':
                    await this.crawlSspai(task);
                    break;
                case 'itjuzi':
                    await this.crawlItjuzi(task);
                    break;
            }

            // 更新任务状态
            await db.execute(
                'UPDATE crawler_tasks SET status = ?, next_run = DATE_ADD(NOW(), INTERVAL 1 DAY) WHERE id = ?',
                ['completed', taskId]
            );
        } catch (error) {
            console.error('爬虫执行失败:', error);
            // 记录错误日志
            await db.execute(
                'INSERT INTO crawler_logs (task_id, status, message) VALUES (?, ?, ?)',
                [taskId, 'error', error.message]
            );
            // 更新任务状态
            await db.execute(
                'UPDATE crawler_tasks SET status = ? WHERE id = ?',
                ['failed', taskId]
            );
        }
    },

    // 36氪爬虫
    async crawl36Kr(task) {
        try {
            const response = await axios.get('https://36kr.com/information/AI/');
            const $ = cheerio.load(response.data);
            
            // 解析页面内容
            const articles = $('.article-item').map((i, el) => {
                return {
                    title: $(el).find('.title').text().trim(),
                    url: $(el).find('a').attr('href'),
                    summary: $(el).find('.summary').text().trim(),
                    publish_date: new Date().toISOString().split('T')[0],
                    source: '36kr',
                    category: 'AI研究'
                };
            }).get();

            // 保存到数据库
            for (const article of articles) {
                await db.execute(`
                    INSERT INTO rankings (title, url, summary, publish_date, source, category)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    summary = VALUES(summary)
                `, [
                    article.title,
                    article.url,
                    article.summary,
                    article.publish_date,
                    article.source,
                    article.category
                ]);
            }

            // 记录成功日志
            await db.execute(
                'INSERT INTO crawler_logs (task_id, status, message) VALUES (?, ?, ?)',
                [task.id, 'success', `成功抓取 ${articles.length} 条数据`]
            );
        } catch (error) {
            throw new Error(`36氪爬虫失败: ${error.message}`);
        }
    },

    // 爱分析爬虫
    async crawlAnalysys(task) {
        try {
            const response = await axios.get('https://www.analysys.cn/article/list/400', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(response.data);
            
            const articles = $('.article-list-item').map((i, el) => {
                return {
                    title: $(el).find('.title').text().trim(),
                    url: 'https://www.analysys.cn' + $(el).find('a').attr('href'),
                    summary: $(el).find('.desc').text().trim(),
                    publish_date: $(el).find('.date').text().trim(),
                    source: 'analysys',
                    category: 'AI研究'
                };
            }).get();

            // 保存到数据库
            for (const article of articles) {
                await db.execute(`
                    INSERT INTO rankings (title, url, summary, publish_date, source, category)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    summary = VALUES(summary)
                `, [
                    article.title,
                    article.url,
                    article.summary,
                    article.publish_date,
                    article.source,
                    article.category
                ]);
            }

            await db.execute(
                'INSERT INTO crawler_logs (task_id, status, message) VALUES (?, ?, ?)',
                [task.id, 'success', `成功抓取 ${articles.length} 条数据`]
            );
        } catch (error) {
            throw new Error(`爱分析爬虫失败: ${error.message}`);
        }
    },

    // 阿里云爬虫
    async crawlAliyun(task) {
        try {
            const response = await axios.get('https://developer.aliyun.com/article/ai', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(response.data);
            
            const articles = $('.article-item').map((i, el) => {
                const dateText = $(el).find('.date').text().trim();
                const date = new Date(dateText);
                const formattedDate = date.toISOString().split('T')[0];

                return {
                    title: $(el).find('.title').text().trim(),
                    url: 'https://developer.aliyun.com' + $(el).find('a').attr('href'),
                    summary: $(el).find('.summary').text().trim(),
                    publish_date: formattedDate,
                    source: 'aliyun',
                    category: 'AI应用'
                };
            }).get();

            // 保存到数据库
            for (const article of articles) {
                await db.execute(`
                    INSERT INTO rankings (title, url, summary, publish_date, source, category)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    summary = VALUES(summary)
                `, [
                    article.title,
                    article.url,
                    article.summary,
                    article.publish_date,
                    article.source,
                    article.category
                ]);
            }

            await db.execute(
                'INSERT INTO crawler_logs (task_id, status, message) VALUES (?, ?, ?)',
                [task.id, 'success', `成功抓取 ${articles.length} 条数据`]
            );
        } catch (error) {
            throw new Error(`阿里云爬虫失败: ${error.message}`);
        }
    },

    // 少数派爬虫
    async crawlSspai(task) {
        try {
            const response = await axios.get('https://sspai.com/tag/AI', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(response.data);
            
            const articles = $('.article-card').map((i, el) => {
                return {
                    title: $(el).find('.title').text().trim(),
                    url: 'https://sspai.com' + $(el).find('a').attr('href'),
                    summary: $(el).find('.desc').text().trim(),
                    publish_date: new Date().toISOString().split('T')[0], // 使用当前日期，因为页面可能没有显示日期
                    source: 'sspai',
                    category: 'AI工具'
                };
            }).get();

            // 保存到数据库
            for (const article of articles) {
                await db.execute(`
                    INSERT INTO rankings (title, url, summary, publish_date, source, category)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    summary = VALUES(summary)
                `, [
                    article.title,
                    article.url,
                    article.summary,
                    article.publish_date,
                    article.source,
                    article.category
                ]);
            }

            await db.execute(
                'INSERT INTO crawler_logs (task_id, status, message) VALUES (?, ?, ?)',
                [task.id, 'success', `成功抓取 ${articles.length} 条数据`]
            );
        } catch (error) {
            throw new Error(`少数派爬虫失败: ${error.message}`);
        }
    },

    // IT桔子爬虫
    async crawlItjuzi(task) {
        try {
            const response = await axios.get('https://www.itjuzi.com/ai', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(response.data);
            
            const articles = $('.news-item').map((i, el) => {
                return {
                    title: $(el).find('.title').text().trim(),
                    url: $(el).find('a').attr('href'),
                    summary: $(el).find('.summary').text().trim(),
                    publish_date: $(el).find('.date').text().trim(),
                    source: 'itjuzi',
                    category: 'AI软件'
                };
            }).get();

            // 保存到数据库
            for (const article of articles) {
                await db.execute(`
                    INSERT INTO rankings (title, url, summary, publish_date, source, category)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    summary = VALUES(summary)
                `, [
                    article.title,
                    article.url,
                    article.summary,
                    article.publish_date,
                    article.source,
                    article.category
                ]);
            }

            await db.execute(
                'INSERT INTO crawler_logs (task_id, status, message) VALUES (?, ?, ?)',
                [task.id, 'success', `成功抓取 ${articles.length} 条数据`]
            );
        } catch (error) {
            throw new Error(`IT桔子爬虫失败: ${error.message}`);
        }
    }
};

module.exports = crawlerController; 