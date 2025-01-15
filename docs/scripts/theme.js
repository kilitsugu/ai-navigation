// 主题配置
const themes = {
    light: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f5f5f5',
        '--text-primary': '#333333',
        '--text-secondary': '#666666',
        '--primary-color': '#007AFF',
        '--primary-dark': '#0066DD',
        '--border-color': '#e0e0e0'
    },
    dark: {
        '--bg-primary': '#1a1a1a',
        '--bg-secondary': '#2d2d2d',
        '--text-primary': '#ffffff',
        '--text-secondary': '#cccccc',
        '--primary-color': '#0A84FF',
        '--primary-dark': '#0066CC',
        '--border-color': '#404040'
    }
};

// 主题切换功能
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(themeName) {
    const theme = themes[themeName];
    Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });
    localStorage.setItem('theme', themeName);
}

// 初始化主题
document.addEventListener('DOMContentLoaded', initTheme); 