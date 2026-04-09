
document.addEventListener('DOMContentLoaded', function() {
    // إضافة مسارات الصفحات
    const pageRoutes = {
        'Dashboard': '/pna/frontend/Instractor/dashboard/dashboard.html',
        'Courses': '/pna/frontend/Instractor/Courses/courses.html',
        'Students': '/pna/frontend/Instractor/student/Students.html',
        'Transactions': '/pna/frontend/Instractor/transaction/transactions.html',
        'Chat': '/pna/frontend/Instractor/chat/chats.html',
        'Schedule': '/pna/frontend/Instractor/schedule/schedule.html',
        'Live Class': '/pna/frontend/Instractor/liveClass/liveClass.html',
        'Settings': '/pna/frontend/Instractor/setting/setting.html',
        'Logout': '/pna/frontend/logout/logout.html'
    };

    // إضافة مستمع الأحداث لكل عنصر في القائمة
    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // إزالة الكلاس active من جميع العناصر
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // إضافة الكلاس active للعنصر المضغوط
            this.classList.add('active');
            
            // الحصول على نص العنصر
            const text = this.querySelector('span').textContent;
            
            // التنقل إلى الصفحة المناسبة
            if (pageRoutes[text]) {
                window.location.href = pageRoutes[text];
            }
        });
    });

    // Chart.js Implementation
    const activityChart = document.getElementById('activityChart');
    new Chart(activityChart, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'User Activity',
                data: [65, 59, 80, 81, 56, 85, 70],
                borderColor: '#1E90FF',
                backgroundColor: 'rgba(30, 144, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#1E90FF',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(30, 144, 255, 0.1)'
                    },
                    ticks: {
                        color: '#1E90FF',
                        font: {
                            size: 10
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#1E90FF',
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
});

// Helper Functions
function generateRandomData(count) {
    return Array.from({length: count}, () => Math.floor(Math.random() * 1000));
}

// Calendar Implementation
function initCalendar() {
    const daysContainer = document.querySelector('.days');
    const monthYear = document.querySelector('.month-year');
    const prevBtn = document.querySelector('.prev-month');
    const nextBtn = document.querySelector('.next-month');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const monthLength = lastDay.getDate();

        monthYear.textContent = new Date(currentYear, currentMonth).toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });

        let days = '';
        for (let i = 0; i < startingDay; i++) {
            days += '<span></span>';
        }

        for (let day = 1; day <= monthLength; day++) {
            const isToday = day === currentDate.getDate() && 
                           currentMonth === currentDate.getMonth() && 
                           currentYear === currentDate.getFullYear();
            days += `<span class="${isToday ? 'today' : ''}">${day}</span>`;
        }

        daysContainer.innerHTML = days;
    }

    prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    renderCalendar();
}

// تشغيل التقويم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initCalendar);
