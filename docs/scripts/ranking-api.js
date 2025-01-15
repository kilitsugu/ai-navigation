const API_URL = 'http://localhost:3000/api';

// 获取榜单列表
async function getRankings(params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/rankings?${queryString}`);

        if (!response.ok) {
            throw new Error('获取榜单列表失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取榜单列表失败:', error);
        throw error;
    }
}

// 获取榜单详情
async function getRankingById(id) {
    try {
        const response = await fetch(`${API_URL}/rankings/${id}`);

        if (!response.ok) {
            throw new Error('获取榜单详情失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取榜单详情失败:', error);
        throw error;
    }
}

// 添加自动刷新功能
async function autoRefresh() {
    try {
        await fetchRankings();
        console.log('数据已更新:', new Date().toLocaleString());
    } catch (error) {
        console.error('自动更新失败:', error);
    }
}

// 页面加载时启动自动刷新
document.addEventListener('DOMContentLoaded', () => {
    // 立即执行一次
    fetchRankings();
    
    // 每5分钟执行一次
    setInterval(autoRefresh, 5 * 60 * 1000);
});

// 添加加载状态指示器
function showLoading() {
    const container = document.querySelector('.rankings');
    container.classList.add('loading');
}

function hideLoading() {
    const container = document.querySelector('.rankings');
    container.classList.remove('loading');
}

// 修改 fetchRankings 函数
async function fetchRankings() {
    showLoading();
    try {
        const response = await fetch('http://localhost:3000/api/toolify/rankings');
        const data = await response.json();
        
        if (data.success) {
            displayRankings(data.data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('获取榜单失败:', error);
        showError('获取榜单数据失败，请稍后重试');
    } finally {
        hideLoading();
    }
}

function displayRankings(rankings) {
    const container = document.querySelector('.rankings');
    container.innerHTML = rankings.map((ranking, index) => `
        <div class="ranking-card">
            <div class="rank">#${index + 1}</div>
            <div class="source">来源：${ranking.source}</div>
            <h3 class="title">
                <a href="${ranking.url}" target="_blank">${ranking.title}</a>
            </h3>
            <p class="summary">${ranking.summary}</p>
            <div class="meta">
                <span class="date">${ranking.publish_date}</span>
                <span class="visits">${ranking.visits} 访问</span>
                <span class="growth">${ranking.growth_rate}</span>
                <span class="category">${ranking.category}</span>
            </div>
            <div class="tags">
                ${JSON.parse(ranking.tags).map(tag => 
                    `<span class="tag">${tag}</span>`
                ).join('')}
            </div>
        </div>
    `).join('');
}

// 页面加载时获取数据
document.addEventListener('DOMContentLoaded', fetchRankings); 