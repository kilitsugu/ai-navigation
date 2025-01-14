document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 获取初始数据
        await loadRankings();
        // 设置分类筛选
        setupCategoryFilter();
        // 设置搜索功能
        setupSearch();
    } catch (error) {
        console.error('加载榜单列表失败:', error);
    }
});

// 当前页码和每页数量
let currentPage = 1;
const pageSize = 10;

// 加载榜单数据
async function loadRankings(params = {}) {
    const rankingsList = document.querySelector('.rankings');
    const searchLoading = document.querySelector('.search .loading');
    const searchInfo = document.querySelector('.search-info');

    try {
        // 显示加载状态
        rankingsList.classList.add('loading');
        if (params.search) {
            searchLoading.style.display = 'block';
        }

        const queryParams = {
            page: currentPage,
            limit: pageSize,
            ...params
        };

        const { data: rankings, pagination } = await getRankings(queryParams);
        
        // 更新搜索结果提示
        if (params.search) {
            searchInfo.style.display = 'block';
            searchInfo.querySelector('.highlight').textContent = params.search;
            searchInfo.querySelector('.result-count').textContent = pagination.total;
        } else {
            searchInfo.style.display = 'none';
        }

        displayRankings(rankings);
        setupPagination(pagination);
    } catch (error) {
        console.error('加载榜单列表失败:', error);
        rankingsList.innerHTML = '<div class="no-data">加载失败，请稍后重试</div>';
    } finally {
        // 移除加载状态
        rankingsList.classList.remove('loading');
        searchLoading.style.display = 'none';
    }
}

// 显示榜单列表
function displayRankings(rankings) {
    const rankingsList = document.querySelector('.rankings');
    
    if (rankings.length === 0) {
        rankingsList.innerHTML = `
            <div class="no-data">
                <p>暂无相关数据</p>
                <p>试试其他关键词吧</p>
            </div>
        `;
        return;
    }

    rankingsList.innerHTML = rankings.map(ranking => `
        <div class="ranking-card">
            <div class="source">来源：${ranking.source}</div>
            <h3 class="title">
                <a href="ranking-detail.html?id=${ranking.id}">${ranking.title}</a>
            </h3>
            <p class="summary">${ranking.summary}</p>
            <div class="meta">
                <span class="date">${ranking.publish_date}</span>
                <span class="category">${ranking.category}</span>
            </div>
        </div>
    `).join('');
}

// 设置分页
function setupPagination(pagination) {
    const { total, current_page, per_page } = pagination;
    const totalPages = Math.ceil(total / per_page);
    
    const pageNumbers = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // 更新上一页/下一页按钮状态
    prevBtn.disabled = current_page === 1;
    nextBtn.disabled = current_page === totalPages;
    
    // 生成页码按钮
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || // 第一页
            i === totalPages || // 最后一页
            (i >= current_page - 2 && i <= current_page + 2) // 当前页附近的页码
        ) {
            buttons += `<button class="${i === current_page ? 'active' : ''}">${i}</button>`;
        } else if (i === current_page - 3 || i === current_page + 3) {
            buttons += '<span>...</span>';
        }
    }
    pageNumbers.innerHTML = buttons;
    
    // 添加页码点击事件
    pageNumbers.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            currentPage = parseInt(button.textContent);
            loadRankings();
        });
    });
    
    // 添加上一页/下一页点击事件
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadRankings();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadRankings();
        }
    });
}

// 设置分类筛选
function setupCategoryFilter() {
    const categoryList = document.querySelector('.category-list');
    categoryList.addEventListener('click', async (e) => {
        if (e.target.tagName === 'LI') {
            // 更新激活状态
            document.querySelectorAll('.category-list li').forEach(li => {
                li.classList.remove('active');
            });
            e.target.classList.add('active');

            // 重置页码并获取筛选后的榜单
            currentPage = 1;
            const category = e.target.textContent === '全部' ? '' : e.target.textContent;
            await loadRankings({ category });
        }
    });
}

// 设置搜索功能
function setupSearch() {
    const searchInput = document.querySelector('.search input');
    let searchTimeout;
    let lastSearchTerm = '';

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value.trim();
        
        // 如果搜索词未改变，不重新搜索
        if (searchTerm === lastSearchTerm) {
            return;
        }

        // 显示加载图标
        const searchLoading = document.querySelector('.search .loading');
        searchLoading.style.display = 'block';

        searchTimeout = setTimeout(async () => {
            currentPage = 1;
            lastSearchTerm = searchTerm;
            
            if (searchTerm) {
                await loadRankings({ search: searchTerm });
            } else {
                await loadRankings();
            }
        }, 500);
    });

    // 添加清空搜索功能
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            loadRankings();
        }
    });
} 