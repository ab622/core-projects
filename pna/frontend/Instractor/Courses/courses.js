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
    // Search Functionality
    const searchInput = document.querySelector('.search-box input');
    const courseCards = document.querySelectorAll('.course-card');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();

        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const info = card.querySelector('.course-info').textContent.toLowerCase();

            if (title.includes(searchTerm) || info.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Filter Functionality
    const filterSelect = document.querySelector('.filter-select');

    filterSelect.addEventListener('change', function(e) {
        const filterValue = e.target.value;

        courseCards.forEach(card => {
            const status = card.querySelector('.status').textContent.toLowerCase();

            if (filterValue === 'all' || status === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Course Actions Handlers
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const action = this.classList[1];
            const courseName = this.closest('.course-card').querySelector('h3').textContent;

            switch(action) {
                case 'manage':
                    handleManageCourse(courseName);
                    break;
                case 'students':
                    handleViewStudents(courseName);
                    break;
                case 'assignments':
                    handleAssignments(courseName);
                    break;
                case 'results':
                    handleViewResults(courseName);
                    break;
                case 'feedback':
                    handleFeedback(courseName);
                    break;
                case 'archive':
                    handleArchive(courseName);
                    break;
            }
        });
    });

    // Add New Course Button Handler
    document.querySelector('.add-course-btn').addEventListener('click', function() {
        openModal();
    });

    // Example handler functions
    function handleManageCourse(courseName) {
        console.log(`Managing course: ${courseName}`);
        // Navigate to course management page or open modal
    }

    function handleViewStudents(courseName) {
        console.log(`Viewing students for: ${courseName}`);
        // Navigate to students list or open modal
    }

    function handleAssignments(courseName) {
        console.log(`Managing assignments for: ${courseName}`);
        // Navigate to assignments page or open modal
    }

    function handleViewResults(courseName) {
        console.log(`Viewing results for: ${courseName}`);
        // Navigate to results page or open modal
    }

    function handleFeedback(courseName) {
        console.log(`Viewing feedback for: ${courseName}`);
        // Navigate to feedback page or open modal
    }

    function handleArchive(courseName) {
        if(confirm(`Are you sure you want to archive ${courseName}?`)) {
            console.log(`Archiving course: ${courseName}`);
            // Implement archive functionality
        }
    }

    // Modal Functions
    const modal = document.getElementById('createCourseModal');
    const closeBtn = document.querySelector('.close');

    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // Close modal when clicking X button
    closeBtn.addEventListener('click', closeModal);

    // Form submission
    document.getElementById('createCourseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(this);
        const courseData = {};
        
        formData.forEach((value, key) => {
            courseData[key] = value;
        });
        
        // Here you would typically send this data to your backend
        console.log('New course data:', courseData);
        
        // Close the modal and reset form
        closeModal();
        this.reset();
        
        // Show success message (you can customize this)
        alert('Course created successfully!');
    });

    // Animate Statistics on Page Load
    function animateStats() {
        const stats = document.querySelectorAll('.stat-info span');
        stats.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            let currentValue = 0;
            const duration = 1500; // 1.5 seconds
            const increment = finalValue / (duration / 16); // 60fps

            function updateValue() {
                if(currentValue < finalValue) {
                    currentValue += increment;
                    stat.textContent = Math.round(currentValue);
                    requestAnimationFrame(updateValue);
                } else {
                    stat.textContent = finalValue;
                }
            }

            updateValue();
        });
    }

    // Run animations
    animateStats();
});
