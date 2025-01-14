document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.auth-form');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;
        
        try {
            await login(username, password);
            
            if (remember) {
                // 如果选择了"记住我"，可以在这里设置更长的 token 有效期
                localStorage.setItem('rememberMe', 'true');
            }
        } catch (error) {
            console.error('登录失败:', error);
        }
    });

    // 获取密码输入框和切换按钮
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.toggle-password');
    
    // 添加点击事件监听器
    toggleButton.addEventListener('click', function() {
        // 切换密码可见性
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // 切换图标
        toggleButton.classList.toggle('password-visible');
    });
}); 