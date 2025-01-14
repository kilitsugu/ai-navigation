document.addEventListener('DOMContentLoaded', function() {
    // 菜单切换
    const menuItems = document.querySelectorAll('.admin-menu .menu-item');
    const sections = document.querySelectorAll('.section');
    const breadcrumb = document.querySelector('.breadcrumb');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 更新菜单激活状态
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // 更新面包屑
            breadcrumb.textContent = item.textContent.trim();

            // 切换内容区域
            const targetId = item.getAttribute('href').slice(1);
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // 退出登录
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = '../index.html';
            }
        });
    }

    // 表格操作
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('edit')) {
                // 编辑操作
                alert('编辑功能开发中...');
            } else if (button.classList.contains('delete')) {
                // 删除操作
                if (confirm('确定要删除吗？')) {
                    const row = button.closest('tr');
                    row.style.opacity = '0';
                    setTimeout(() => {
                        row.remove();
                    }, 300);
                }
            }
        });
    });

    // 爬虫任务操作
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            alert('正在刷新任务状态...');
        });
    }

    // 搜索功能
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const table = input.closest('section').querySelector('.data-table');
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    });
}); 