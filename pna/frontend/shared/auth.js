document.addEventListener('DOMContentLoaded', function() {
    // التحقق من أننا في صفحة logout
    if (window.location.pathname.includes('/logout/logout.html')) {
        // تحديث معلومات المستخدم
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        console.log('User Data:', userData);

        // تحديث العناصر في الصفحة بعد مسح المحتوى القديم
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');

        if (userName) {
            userName.innerHTML = '';
            userName.textContent = userData.username || 'User';
        }
        if (userEmail) {
            userEmail.innerHTML = '';
            userEmail.textContent = userData.email || 'user@example.com';
        }

        // إضافة event listener لزر Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = function() {
                // إضافة رسالة التأكيد
                if (confirm('Are you sure you want to logout?')) {
                    fetch('/pna/backend/logout.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user_data');
                        window.location.href = '/pna/frontend/home1/home1.html';
                    })
                    .catch(error => {
                        console.error('Logout error:', error);
                        alert('Error during logout');
                    });
                }
            };
        }
    } else {
        // في الصفحات الأخرى
        const logoutLinks = document.querySelectorAll('[href="/pna/frontend/logout/logout.html"]');
        logoutLinks.forEach(link => {
            link.onclick = function(e) {
                e.preventDefault();
                window.location.href = '/pna/frontend/logout/logout.html';
            };
        });
    }
});
