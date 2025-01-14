const API_URL = 'http://localhost:3000/api';

// 获取爬虫任务列表
async function getCrawlerTasks() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/crawler/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('获取爬虫任务列表失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取爬虫任务列表失败:', error);
        throw error;
    }
}

// 启动爬虫任务
async function startCrawlerTask(taskId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/crawler/tasks/${taskId}/start`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('启动爬虫任务失败');
        }

        return await response.json();
    } catch (error) {
        console.error('启动爬虫任务失败:', error);
        throw error;
    }
}

// 停止爬虫任务
async function stopCrawlerTask(taskId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/crawler/tasks/${taskId}/stop`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('停止爬虫任务失败');
        }

        return await response.json();
    } catch (error) {
        console.error('停止爬虫任务失败:', error);
        throw error;
    }
}

// 获取任务日志
async function getCrawlerTaskLogs(taskId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/crawler/tasks/${taskId}/logs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('获取任务日志失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取任务日志失败:', error);
        throw error;
    }
} 