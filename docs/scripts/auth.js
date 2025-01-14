const API_URL = 'http://localhost:3000/api';

// 登录函数
async function login(username, password) {
    try {
        console.log('Attempting login:', { username });

        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (!response.ok) {
            throw new Error(data.message || '登录失败');
        }

        // 保存 token 到 localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // 根据用户角色跳转到不同页面
        if (data.user.role === 'admin') {
            window.location.href = '/admin/index.html';
        } else {
            window.location.href = '/user-center.html';
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message);
    }
}

// 注册函数
async function register(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert('注册成功，请登录');
        window.location.href = '/login.html';
    } catch (error) {
        alert(error.message);
    }
} 