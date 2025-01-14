document.addEventListener('DOMContentLoaded', async function() {
    // 检查用户是否已登录
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        // 获取并显示用户信息
        const userProfile = await getUserProfile();
        displayUserProfile(userProfile);

        // 获取并显示用户收藏
        const favorites = await getUserFavorites();
        displayFavorites(favorites);
    } catch (error) {
        console.error('加载用户数据失败:', error);
        // 如果是认证错误，重定向到登录页面
        if (error.message.includes('认证失败')) {
            window.location.href = '/login.html';
        }
    }

    // 处理个人信息表单提交
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                email: e.target.querySelector('input[type="email"]').value
            };
            
            try {
                await updateUserProfile(formData);
                alert('保存成功！');
            } catch (error) {
                alert('保存失败：' + error.message);
            }
        });
    }

    // 处理取消收藏
    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', async () => {
            const card = button.closest('.ranking-card');
            const rankingId = card.dataset.rankingId;
            
            try {
                await removeFavorite(rankingId);
                card.style.opacity = '0';
                setTimeout(() => card.remove(), 300);
            } catch (error) {
                alert('取消收藏失败：' + error.message);
            }
        });
    });
});

// 显示用户信息
function displayUserProfile(user) {
    document.querySelector('.username').textContent = user.username;
    document.querySelector('input[type="email"]').value = user.email;
}

// 显示收藏列表
function displayFavorites(favorites) {
    const favoritesList = document.querySelector('.favorites-list');
    favoritesList.innerHTML = favorites.map(favorite => `
        <div class="ranking-card" data-ranking-id="${favorite.id}">
            <div class="source">来源：${favorite.source}</div>
            <h3 class="title">${favorite.title}</h3>
            <p class="summary">${favorite.summary}</p>
            <div class="meta">
                <span class="date">${favorite.publish_date}</span>
                <button class="remove-favorite">取消收藏</button>
            </div>
        </div>
    `).join('');
} 