document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadRankings();
        setupEventListeners();
    } catch (error) {
        console.error('初始化失败:', error);
    }
});

// 当前页码和每页数量
let currentPage = 1;
const pageSize = 10;

// 加载榜单数据
async function loadRankings(params = {}) {
    const rankingsTable = document.querySelector('.rankings-table tbody');
    const loadingIndicator = document.querySelector('.loading-indicator');

    try {
        loadingIndicator.style.display = 'block';

        const queryParams = {
            page: currentPage,
            limit: pageSize,
            ...params
        };

        const { data: rankings, pagination } = await getAdminRankings(queryParams);
        displayRankings(rankings);
        setupPagination(pagination);
    } catch (error) {
        console.error('加载榜单失败:', error);
        alert('加载榜单失败，请重试');
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// 显示榜单列表
function displayRankings(rankings) {
    const rankingsTable = document.querySelector('.rankings-table tbody');
    
    rankingsTable.innerHTML = rankings.map(ranking => `
        <tr data-id="${ranking.id}">
            <td>${ranking.id}</td>
            <td>${ranking.title}</td>
            <td>${ranking.source}</td>
            <td>${ranking.category}</td>
            <td>${ranking.publish_date}</td>
            <td>
                <button class="edit-btn" onclick="editRanking(${ranking.id})">编辑</button>
                <button class="delete-btn" onclick="confirmDelete(${ranking.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

// 设置事件监听
function setupEventListeners() {
    // 添加榜单按钮
    document.querySelector('.add-ranking-btn').addEventListener('click', () => {
        showRankingModal();
    });

    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.trim();
            currentPage = 1;
            loadRankings({ search: searchTerm });
        }, 500);
    });

    // 模态框关闭按钮
    document.querySelector('.modal-close').addEventListener('click', () => {
        hideRankingModal();
    });

    // 表单提交
    document.querySelector('.ranking-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const rankingId = e.target.dataset.rankingId;
            if (rankingId) {
                await updateRanking(rankingId, data);
                alert('更新成功');
            } else {
                await addRanking(data);
                alert('添加成功');
            }
            hideRankingModal();
            loadRankings();
        } catch (error) {
            alert(error.message);
        }
    });
}

// 显示编辑模态框
function showRankingModal(ranking = null) {
    const modal = document.querySelector('.ranking-modal');
    const form = modal.querySelector('.ranking-form');
    const title = modal.querySelector('.modal-title');

    if (ranking) {
        title.textContent = '编辑榜单';
        form.dataset.rankingId = ranking.id;
        Object.entries(ranking).forEach(([key, value]) => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) input.value = value;
        });
    } else {
        title.textContent = '添加榜单';
        form.dataset.rankingId = '';
        form.reset();
    }

    modal.style.display = 'block';
}

// 隐藏模态框
function hideRankingModal() {
    const modal = document.querySelector('.ranking-modal');
    modal.style.display = 'none';
}

// 编辑榜单
async function editRanking(id) {
    try {
        const { data: ranking } = await getAdminRankings({ id });
        showRankingModal(ranking);
    } catch (error) {
        alert('获取榜单信息失败');
    }
}

// 确认删除
function confirmDelete(id) {
    if (confirm('确定要删除这个榜单吗？此操作不可恢复！')) {
        deleteRanking(id).then(() => {
            alert('删除成功');
            loadRankings();
        }).catch(error => {
            alert('删除失败：' + error.message);
        });
    }
} 