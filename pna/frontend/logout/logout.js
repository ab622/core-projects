document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutAllDevices = document.getElementById('logoutAll');
    const container = document.querySelector('.logout-container');

    // تأثير نبض للشعار عند التحميل
    const logo = document.querySelector('.logo');
    logo.style.animation = 'pulse 2s infinite';

    // معالجة حدث الضغط على زر Logout
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // تغيير حالة الزر إلى حالة التحميل
        logoutBtn.disabled = true;
        const originalText = logoutBtn.innerHTML;
        logoutBtn.innerHTML = `
            <div class="loader"></div>
            <span>Logging out...</span>
        `;

        // محاكاة عملية تسجيل الخروج
        setTimeout(() => {
            handleLogout(logoutAllDevices.checked);
        }, 1500);
    });

    // وظيفة معالجة تسجيل الخروج
    function handleLogout(logoutAll) {
        // حذف بيانات الجلسة
        sessionStorage.clear();
        
        // حذف بيانات التخزين المحلي إذا تم اختيار تسجيل الخروج من جميع الأجهزة
        if(logoutAll) {
            localStorage.clear();
        }

        // إظهار رسالة نجاح قبل إعادة التوجيه
        showNotification('Logout successful!', 'success');

        // إعادة التوجيه إلى صفحة تسجيل الدخول بعد ثانيتين
        setTimeout(() => {
            window.location.href = '/Project Of Semester/frontend/login/login.html';
        }, 2000);
    }

    // وظيفة إظهار الإشعارات
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `logout-notification ${type}`;
        notification.innerHTML = `
            <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // إضافة الأنماط للإشعار
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease;
            z-index: 1000;
        `;

        // إخفاء الإشعار بعد 3 ثواني
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // إضافة تأثيرات CSS للإشعارات
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        .loader {
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // معالجة الضغط على زر ESC للإلغاء
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.history.back();
        }
    });

    // معالجة النقر خارج مربع تسجيل الخروج
    container.addEventListener('click', function(e) {
        if (e.target === container) {
            window.history.back();
        }
    });

    // تحديث معلومات المستخدم من localStorage إذا كانت متوفرة
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
        document.querySelector('.user-name').textContent = userInfo.name || 'John Doe';
        document.querySelector('.user-email').textContent = userInfo.email || 'john@example.com';
        if (userInfo.avatar) {
            document.querySelector('.user-avatar').src = userInfo.avatar;
        }
    }

    // إضافة هذه الدالة في ملفات JavaScript الخاصة بصفحات student و instructor
    function handleLogout() {
        // إظهار تأكيد قبل تسجيل الخروج
        if (confirm('Are you sure you want to logout?')) {
            // إرسال طلب للـ backend
            fetch('/pna/backend/logout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    // مسح البيانات المحلية
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                    
                    // التوجيه لصفحة تسجيل الدخول
                    window.location.href = '/pna/frontend/Login/login.html';
                } else {
                    alert(data.message || 'Logout failed!');
                }
            })
            .catch(error => {
                console.error('Logout error:', error);
                alert('Error during logout');
            });
        }
    }

    // إضافة event listener لزر الـ logout
    document.querySelector('.logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
    });
}); 