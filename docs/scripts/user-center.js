document.addEventListener('DOMContentLoaded', () => {
    // 从 localStorage 获取用户信息
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // 设置用户信息
    document.getElementById('username').value = user.username || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('headerUsername').textContent = user.username || '未登录';

    // 处理头像上传
    const avatarInput = document.getElementById('avatarInput');
    avatarInput?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatarUrl = e.target.result;
                document.getElementById('userAvatar').src = avatarUrl;
                document.getElementById('headerAvatar').src = avatarUrl;
                // 这里可以添加上传头像到服务器的代码
            };
            reader.readAsDataURL(file);
        }
    });

    // 处理表单提交
    document.querySelector('.save-button')?.addEventListener('click', async () => {
        const updatedUser = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            bio: document.getElementById('bio').value
        };

        try {
            // 这里添加更新用户信息的 API 调用
            alert('保存成功！');
        } catch (error) {
            alert('保存失败：' + error.message);
        }
    });
}); 