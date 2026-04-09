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
document.addEventListener('DOMContentLoaded', function() {
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
});
document.addEventListener('DOMContentLoaded', function() {
    // Show loading overlay
    showLoading();

    // Initialize Calendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            {
                title: 'Web Development',
                start: '2024-03-20T09:00:00',
                end: '2024-03-20T10:30:00',
                backgroundColor: '#1a237e'
            }
        ],
        eventClick: handleEventClick,
        dateClick: handleDateClick,
        eventDidMount: function(info) {
            // Add tooltip
            tippy(info.el, {
                content: `
                    <strong>${info.event.title}</strong><br>
                    Time: ${formatTime(info.event.start)} - ${formatTime(info.event.end)}<br>
                    Students: 15
                `,
                allowHTML: true,
            });
            // تطبيق اللون الأزرق على الأحداث
            info.el.style.backgroundColor = '#0096ff';
            info.el.style.borderColor = '#00c6ff';
        },
        selectable: true,
        select: function(info) {
            showAddClassModal(info.start);
        },
        
        // منع النقر على التواريخ السابقة
        selectConstraint: {
            start: new Date()
        }
    });
    
    calendar.render();
    hideLoading();

    // Stats Counter Animation
    animateStats();

    // Add Class Button
    const addClassBtn = document.querySelector('.add-class-btn');
    addClassBtn.addEventListener('click', showAddClassModal);
    
    // Calendar View Buttons
    document.querySelectorAll('.calendar-actions button').forEach(button => {
        button.addEventListener('click', () => {
            const view = button.textContent.toLowerCase();
            calendar.changeView(view === 'month' ? 'dayGridMonth' : 
                              view === 'week' ? 'timeGridWeek' : 'timeGridDay');
            showToast(`Switched to ${view} view`);
        });
    });
});

// Helper Functions
function showLoading() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-info .number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        animateValue(stat, 0, target, 2000);
    });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function handleEventClick(info) {
    const event = info.event;
    Swal.fire({
        title: event.title,
        html: `
            <div class="event-details">
                <p><i class="fas fa-clock"></i> ${formatTime(event.start)} - ${formatTime(event.end)}</p>
                <p><i class="fas fa-users"></i> 15 Students</p>
                <p><i class="fas fa-chalkboard"></i> Room 101</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Edit Class',
        cancelButtonText: 'Close'
    }).then((result) => {
        if (result.isConfirmed) {
            showEditClassModal(event);
        }
    });
}

function handleDateClick(info) {
    showAddClassModal(info.date);
}

function showAddClassModal(date) {
    Swal.fire({
        title: 'Add New Class',
        html: `
            <input type="text" id="classTitle" class="swal2-input" placeholder="Class Title">
            <input type="datetime-local" id="classDateTime" class="swal2-input" value="${formatDateForInput(date)}">
            <select id="classCourse" class="swal2-select">
                <option value="">Select Course</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile Development</option>
                <option value="data">Data Science</option>
                <option value="ui">UI/UX Design</option>
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add Class',
        cancelButtonText: 'Cancel',
        showCloseButton: true,
        preConfirm: () => {
            const title = document.getElementById('classTitle').value;
            const dateTime = document.getElementById('classDateTime').value;
            const course = document.getElementById('classCourse').value;

            if (!title || !dateTime || !course) {
                Swal.showValidationMessage('Please fill all fields');
                return false;
            }

            return { title, dateTime, course };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Class Added Successfully',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const container = document.querySelector('.toast-container') || 
                     (() => {
                         const cont = document.createElement('div');
                         cont.className = 'toast-container';
                         document.body.appendChild(cont);
                         return cont;
                     })();
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateForInput(date) {
    return date.toISOString().slice(0, 16);
}

// Add button click handler
document.querySelector('.add-button').addEventListener('click', () => {
    showAddClassModal(new Date());
});
