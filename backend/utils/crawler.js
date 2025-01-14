const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

class CrawlerUtils {
    static async fetchWithRetry(url, options = {}, retries = 3) {
        try {
            const response = await axios({
                url,
                ...options,
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    ...options.headers
                }
            });
            return response;
        } catch (error) {
            if (retries > 0) {
                console.log(`请求失败，重试剩余次数: ${retries - 1}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.fetchWithRetry(url, options, retries - 1);
            }
            throw error;
        }
    }

    static async fetchWithProxy(url, options = {}) {
        const proxyList = [
            'http://proxy1.example.com:8080',
            'http://proxy2.example.com:8080',
            'http://proxy3.example.com:8080'
        ];

        const proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
        const httpsAgent = new HttpsProxyAgent(proxy);

        return this.fetchWithRetry(url, {
            ...options,
            httpsAgent
        });
    }

    static formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0];
        } catch (error) {
            return new Date().toISOString().split('T')[0];
        }
    }

    static sanitizeText(text) {
        return text
            .replace(/[\n\r\t]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    static async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = CrawlerUtils; 