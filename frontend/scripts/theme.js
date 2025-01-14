// 主题切换功能
const themes = {
    default: '默认蓝',
    purple: '优雅紫',
    green: '自然绿',
    dark: '暗夜'
};

function initTheme() {
    // 创建主题切换按钮
    const themeSwitch = document.createElement('div');
    themeSwitch.className = 'theme-switch';
    themeSwitch.innerHTML = `
        <select class="theme-select">
            ${Object.entries(themes).map(([value, name]) => 
                `<option value="${value}">${name}</option>`
            ).join('')}
        </select>
    `;

    // 添加到页面
    document.querySelector('.header .container').appendChild(themeSwitch);

    // 加载保存的主题
    const savedTheme = localStorage.getItem('theme') || 'default';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeSwitch.querySelector('select').value = savedTheme;

    // 监听主题切换
    themeSwitch.querySelector('select').addEventListener('change', (e) => {
        const theme = e.target.value;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

// 页面加载时初始化主题
document.addEventListener('DOMContentLoaded', initTheme); 