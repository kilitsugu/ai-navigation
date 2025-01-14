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