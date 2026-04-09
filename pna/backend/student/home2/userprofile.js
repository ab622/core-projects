function updateStudentName() {
    fetch('/pna/backend/student/home2/userprofile.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            const welcomeMessage = document.getElementById('welcomeMessage');
            if (welcomeMessage) {
                // استخدام الاسم الكامل إذا كان موجوداً، وإلا استخدام اسم المستخدم
                const name = data.data.full_name || data.data.username;
                welcomeMessage.textContent = `Hello, ${name}!`;
            }
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('API Error:', error);
        // في حالة الخطأ، نعرض اسم المستخدم من localStorage كاحتياطي
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage && userData.username) {
            welcomeMessage.textContent = `Hello ${userData.username} !`;
        }
    });
}

document.addEventListener('DOMContentLoaded', updateStudentName); 