document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadDashboardData();
        setupEventListeners();
        initCharts();
        // 每60秒自动刷新一次数据
        setInterval(loadDashboardData, 60000);
    } catch (error) {
        console.error('初始化仪表盘失败:', error);
    }
});

// 加载仪表盘数据
async function loadDashboardData() {
    try {
        const [systemStatus, statistics, crawlerStatus, logs] = await Promise.all([
            getSystemStatus(),
            getStatistics(),
            getCrawlerStatus(),
            getSystemLogs()
        ]);

        updateSystemStatus(systemStatus);
        updateStatistics(statistics);
        updateCrawlerStatus(crawlerStatus);
        updateLogs(logs);
        updateLastUpdateTime();
    } catch (error) {
        console.error('加载数据失败:', error);
    }
}

// 更新系统状态
function updateSystemStatus(status) {
    document.querySelector('.uptime').textContent = formatUptime(status.uptime);
    document.querySelector('.cpu-usage').textContent = `${status.cpuUsage}%`;
    document.querySelector('.memory-usage').textContent = `${status.memoryUsage}%`;

    // 更新状态标签
    const systemBadge = document.querySelector('.status-card:first-child .status-badge');
    updateStatusBadge(systemBadge, status.status);
}

// 更新统计数据
function updateStatistics(stats) {
    document.querySelector('.rankings-count').textContent = stats.totalRankings;
    document.querySelector('.today-rankings').textContent = stats.todayRankings;
    document.querySelector('.users-count').textContent = stats.totalUsers;
}

// 更新爬虫状态
function updateCrawlerStatus(crawlers) {
    const crawlerContainer = document.querySelector('.crawler-status');
    crawlerContainer.innerHTML = crawlers.map(crawler => `
        <div class="crawler-item">
            <span class="name">${crawler.name}</span>
            <span class="status ${crawler.status.toLowerCase()}">${formatCrawlerStatus(crawler.status)}</span>
        </div>
    `).join('');

    // 更新爬虫整体状态标签
    const crawlerBadge = document.querySelector('.status-card:nth-child(3) .status-badge');
    const overallStatus = calculateOverallCrawlerStatus(crawlers);
    updateStatusBadge(crawlerBadge, overallStatus);
}

// 更新系统日志
function updateLogs(logs) {
    const logList = document.querySelector('.log-list');
    logList.innerHTML = logs.map(log => `
        <div class="log-item">
            <span class="time">${formatTime(log.time)}</span>
            <span class="message">${log.message}</span>
        </div>
    `).join('');
}

// 初始化图表
function initCharts() {
    // 榜单数量趋势图
    const rankingsCtx = document.getElementById('rankingsChart').getContext('2d');
    new Chart(rankingsCtx, {
        type: 'line',
        data: {
            labels: getLast7Days(),
            datasets: [{
                label: '榜单数量',
                data: [65, 78, 82, 75, 90, 85, 88],
                borderColor: '#3B82F6',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 用户活跃度图
    const usersCtx = document.getElementById('usersChart').getContext('2d');
    new Chart(usersCtx, {
        type: 'bar',
        data: {
            labels: getLast7Days(),
            datasets: [{
                label: '活跃用户',
                data: [120, 135, 142, 138, 156, 148, 160],
                backgroundColor: '#3B82F6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 设置事件监听
function setupEventListeners() {
    // 刷新按钮
    document.querySelector('.refresh-btn').addEventListener('click', loadDashboardData);

    // 查看全部日志按钮
    document.querySelector('.view-all-btn').addEventListener('click', () => {
        // 跳转到日志页面
        window.location.href = 'logs.html';
    });
}

// 工具函数
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}天${hours}小时${minutes}分钟`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { hour12: false });
}

function formatCrawlerStatus(status) {
    const statusMap = {
        'running': '运行中',
        'failed': '失败',
        'pending': '等待中',
        'completed': '已完成'
    };
    return statusMap[status] || status;
}

function updateStatusBadge(badge, status) {
    badge.className = 'status-badge';
    badge.classList.add(status.toLowerCase());
    badge.textContent = {
        'success': '正常运行',
        'warning': '部分运行',
        'error': '异常'
    }[status] || status;
}

function calculateOverallCrawlerStatus(crawlers) {
    const runningCount = crawlers.filter(c => c.status === 'running').length;
    const failedCount = crawlers.filter(c => c.status === 'failed').length;
    
    if (failedCount > 0) return 'error';
    if (runningCount === crawlers.length) return 'success';
    return 'warning';
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
    }
    return days;
}

function updateLastUpdateTime() {
    const timeStr = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    document.querySelector('.last-update').textContent = `最后更新: ${timeStr}`;
} 