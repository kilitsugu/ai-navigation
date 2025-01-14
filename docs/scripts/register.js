document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.auth-form');
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const agree = document.querySelector('input[name="agree"]').checked;
        
        // 表单验证
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        if (!agree) {
            alert('请同意服务条款和隐私政策');
            return;
        }
        
        try {
            await register(username, email, password);
        } catch (error) {
            console.error('注册失败:', error);
        }
    });
}); 