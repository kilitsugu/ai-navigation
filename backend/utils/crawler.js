const axios = require('axios');
const cheerio = require('cheerio');

class ToolifyCrawler {
    constructor() {
        this.baseUrl = 'https://www.toolify.ai/zh/Best-trending-AI-Tools';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        };
    }

    async fetchPage() {
        try {
            const response = await axios.get(this.baseUrl, { headers: this.headers });
            return response.data;
        } catch (error) {
            console.error('获取页面失败:', error);
            throw error;
        }
    }

    parseRankings(html) {
        const $ = cheerio.load(html);
        const rankings = [];

        // 查找包含排行数据的表格行
        $('table tr').each((index, element) => {
            if (index === 0) return; // 跳过表头

            const row = $(element);
            const ranking = {
                rank: row.find('td:nth-child(1)').text().trim(),
                title: row.find('td:nth-child(2)').text().trim(),
                visits: row.find('td:nth-child(3)').text().trim(),
                growth: row.find('td:nth-child(4)').text().trim(),
                growthRate: row.find('td:nth-child(5)').text().trim(),
                description: row.find('td:nth-child(6)').text().trim(),
                tags: row.find('td:nth-child(7)').text().trim().split(',').map(tag => tag.trim()),
                url: row.find('td:nth-child(2) a').attr('href'),
                source: 'toolify.ai',
                category: 'AI工具',
                publish_date: new Date().toISOString().split('T')[0]
            };

            rankings.push(ranking);
        });

        return rankings;
    }

    async crawl() {
        try {
            const html = await this.fetchPage();
            const rankings = this.parseRankings(html);
            return rankings;
        } catch (error) {
            console.error('爬取失败:', error);
            throw error;
        }
    }
}

module.exports = ToolifyCrawler; 