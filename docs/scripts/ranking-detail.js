document.addEventListener('DOMContentLoaded', async function() {
    // 从 URL 获取榜单 ID
    const urlParams = new URLSearchParams(window.location.search);
    const rankingId = urlParams.get('id');

    if (!rankingId) {
        window.location.href = '/index.html';
        return;
    }

    try {
        // 获取榜单详情
        const ranking = await getRankingById(rankingId);
        displayRankingDetail(ranking);

        // 检查用户是否已登录
        const token = localStorage.getItem('token');
        if (token) {
            // 显示用户信息
            displayUserInfo();
            // 添加收藏功能
            setupFavoriteButton(rankingId);
        }
    } catch (error) {
        console.error('加载榜单详情失败:', error);
    }
});

// 显示榜单详情
function displayRankingDetail(ranking) {
    document.title = `${ranking.title} - AI导航`;
    
    document.querySelector('.source').textContent = `来源：${ranking.source}`;
    document.querySelector('.date').textContent = ranking.publish_date;
    document.querySelector('.category').textContent = ranking.category;
    document.querySelector('.title').textContent = ranking.title;
    document.querySelector('.summary').textContent = ranking.summary;
    document.querySelector('.source-link').href = ranking.url;
}

// 显示用户信息
function displayUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userActions = document.querySelector('.user-actions');
    
    userActions.innerHTML = `
        <span class="username">${user.username}</span>
        <a href="user-center.html"><button class="user-btn">个人中心</button></a>
    `;
}

// 设置收藏按钮功能
function setupFavoriteButton(rankingId) {
    const favoriteBtn = document.querySelector('.favorite-btn');
    
    favoriteBtn.addEventListener('click', async () => {
        try {
            if (favoriteBtn.classList.contains('favorited')) {
                await removeFavorite(rankingId);
                favoriteBtn.classList.remove('favorited');
                favoriteBtn.textContent = '收藏';
            } else {
                await addFavorite(rankingId);
                favoriteBtn.classList.add('favorited');
                favoriteBtn.textContent = '已收藏';
            }
        } catch (error) {
            alert(error.message);
        }
    });
} 