const API_URL = 'http://localhost:3000/api';

// 获取管理员 token
function getAdminToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return null;
    }
    return token;
}

// 获取榜单列表（管理员）
async function getAdminRankings(params = {}) {
    try {
        const token = getAdminToken();
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/rankings?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('获取榜单列表失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取榜单列表失败:', error);
        throw error;
    }
}

// 添加榜单
async function addRanking(data) {
    try {
        const token = getAdminToken();
        const response = await fetch(`${API_URL}/rankings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('添加榜单失败');
        }

        return await response.json();
    } catch (error) {
        console.error('添加榜单失败:', error);
        throw error;
    }
}

// 更新榜单
async function updateRanking(id, data) {
    try {
        const token = getAdminToken();
        const response = await fetch(`${API_URL}/rankings/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('更新榜单失败');
        }

        return await response.json();
    } catch (error) {
        console.error('更新榜单失败:', error);
        throw error;
    }
}

// 删除榜单
async function deleteRanking(id) {
    try {
        const token = getAdminToken();
        const response = await fetch(`${API_URL}/rankings/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('删除榜单失败');
        }

        return await response.json();
    } catch (error) {
        console.error('删除榜单失败:', error);
        throw error;
    }
}

// 获取系统状态
async function getSystemStatus() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/monitor/system`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('获取系统状态失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取系统状态失败:', error);
        throw error;
    }
}

// 获取统计数据
async function getStatistics() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/monitor/statistics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('获取统计数据失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取统计数据失败:', error);
        throw error;
    }
}

// 获取爬虫状态
async function getCrawlerStatus() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/monitor/crawler`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('获取爬虫状态失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取爬虫状态失败:', error);
        throw error;
    }
}

// 获取系统日志
async function getSystemLogs() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/monitor/logs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('获取系统日志失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取系统日志失败:', error);
        throw error;
    }
} 