const API_URL = 'http://localhost:3000/api';

// 获取用户信息
async function getUserProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('获取用户信息失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
    }
}

// 更新用户信息
async function updateUserProfile(data) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('更新用户信息失败');
        }

        return await response.json();
    } catch (error) {
        console.error('更新用户信息失败:', error);
        throw error;
    }
}

// 获取用户收藏列表
async function getUserFavorites() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/favorites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('获取收藏列表失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取收藏列表失败:', error);
        throw error;
    }
}

// 添加收藏
async function addFavorite(rankingId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/favorites`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rankingId })
        });

        if (!response.ok) {
            throw new Error('添加收藏失败');
        }

        return await response.json();
    } catch (error) {
        console.error('添加收藏失败:', error);
        throw error;
    }
}

// 取消收藏
async function removeFavorite(rankingId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/favorites/${rankingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('取消收藏失败');
        }

        return await response.json();
    } catch (error) {
        console.error('取消收藏失败:', error);
        throw error;
    }
} 