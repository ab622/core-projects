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
const liveClassData = [
    {
        id: 1,
        courseName: 'Advanced Web Development',
        startDateTime: '2024-01-20T14:00:00',
        status: 'Scheduled',
        registeredStudents: 25,
        description: 'Deep dive into modern web technologies.'
    },
    {
        id: 2,
        courseName: 'Machine Learning Fundamentals',
        startDateTime: '2024-01-22T10:00:00',
        status: 'Ongoing',
        registeredStudents: 18,
        description: 'Introduction to ML algorithms.'
    },
    {
        id: 3,
        courseName: 'UI/UX Design Workshop',
        startDateTime: '2024-01-15T16:00:00',
        status: 'Completed',
        registeredStudents: 30,
        description: 'Advanced design principles.'
    },
    {
        id: 4,
        courseName: 'Mobile App Development',
        startDateTime: '2024-01-25T13:00:00',
        status: 'Scheduled',
        registeredStudents: 22,
        description: 'Building iOS and Android apps.'
    },
    {
        id: 5,
        courseName: 'Data Science Basics',
        startDateTime: '2024-01-21T11:00:00',
        status: 'Ongoing',
        registeredStudents: 27,
        description: 'Introduction to data analysis.'
    },
    {
        id: 6,
        courseName: 'Cybersecurity Essentials',
        startDateTime: '2024-01-18T15:00:00',
        status: 'Completed',
        registeredStudents: 20,
        description: 'Network security fundamentals.'
    },
    {
        id: 7,
        courseName: 'Cloud Computing',
        startDateTime: '2024-01-26T14:00:00',
        status: 'Scheduled',
        registeredStudents: 24,
        description: 'AWS and Azure basics.'
    },
    {
        id: 8,
        courseName: 'Python Programming',
        startDateTime: '2024-01-23T09:00:00',
        status: 'Ongoing',
        registeredStudents: 35,
        description: 'Advanced Python concepts.'
    },
    {
        id: 9,
        courseName: 'Digital Marketing',
        startDateTime: '2024-01-19T12:00:00',
        status: 'Completed',
        registeredStudents: 28,
        description: 'SEO and social media marketing.'
    },
    {
        id: 10,
        courseName: 'Blockchain Technology',
        startDateTime: '2024-01-27T10:00:00',
        status: 'Scheduled',
        registeredStudents: 21,
        description: 'Cryptocurrency and smart contracts.'
    }
];

// Initialize dashboard when document is ready
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderClassesTable(liveClassData);
    setupEventListeners();
});

// Update Statistics
function updateStats() {
    const stats = {
        scheduled: liveClassData.filter(cls => cls.status === 'Scheduled').length,
        ongoing: liveClassData.filter(cls => cls.status === 'Ongoing').length,
        completed: liveClassData.filter(cls => cls.status === 'Completed').length
    };

    document.querySelectorAll('.stat-card h3').forEach((card, index) => {
        card.textContent = Object.values(stats)[index];
    });
}

// Render Classes Table
function renderClassesTable(classes) {
    const tableBody = document.getElementById('live-classes-body');
    tableBody.innerHTML = '';

    classes.forEach(cls => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cls.courseName}</td>
            <td>${formatDateTime(cls.startDateTime)}</td>
            <td><span class="status-badge status-${cls.status.toLowerCase()}">${cls.status}</span></td>
            <td>${cls.registeredStudents}</td>
            <td>${calculateTimeRemaining(cls.startDateTime)}</td>
            <td>
                <button class="action-btn ${cls.status === 'Ongoing' ? 'join-class-btn' : 'view-details-btn'}"
                        onclick="handleClassAction(${cls.id})">
                    ${cls.status === 'Ongoing' ? 'Join Class' : 'View Details'}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterClasses(searchTerm, document.getElementById('status-filter').value);
    });

    // Filter functionality
    document.getElementById('status-filter').addEventListener('change', (e) => {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        filterClasses(searchTerm, e.target.value);
    });
}

// Filter Classes
function filterClasses(searchTerm, status) {
    const filteredClasses = liveClassData.filter(cls => {
        const matchesSearch = cls.courseName.toLowerCase().includes(searchTerm);
        const matchesStatus = status === 'All' || cls.status === status;
        return matchesSearch && matchesStatus;
    });

    renderClassesTable(filteredClasses);
}

// Handle Class Action (Join/View)
function handleClassAction(classId) {
    const classData = liveClassData.find(cls => cls.id === classId);
    
    if (classData.status === 'Ongoing') {
        joinClass(classData);
    } else {
        showClassDetails(classData);
    }
}

// Show Class Details
function showClassDetails(classData) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="classDetailsModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Class Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="class-details">
                            <div class="detail-item">
                                <strong>Course:</strong> ${classData.courseName}
                            </div>
                            <div class="detail-item">
                                <strong>Start Time:</strong> ${formatDateTime(classData.startDateTime)}
                            </div>
                            <div class="detail-item">
                                <strong>Status:</strong> 
                                <span class="status-badge status-${classData.status.toLowerCase()}">${classData.status}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Registered Students:</strong> ${classData.registeredStudents}
                            </div>
                            <div class="detail-item">
                                <strong>Description:</strong> ${classData.description}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        ${classData.status === 'Ongoing' ? 
                            `<button type="button" class="btn btn-primary" onclick="joinClass(${classData.id})">Join Class</button>` 
                            : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('classDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize and show modal
    const modal = new bootstrap.Modal(document.getElementById('classDetailsModal'));
    modal.show();
}

// Join Class Function
function joinClass(classData) {
    // Here you would typically redirect to the virtual classroom
    console.log(`Joining class: ${classData.courseName}`);
    
    // Show joining notification
    showNotification('Joining class...', 'success');
    
    // Simulate redirect (replace with actual redirect)
    setTimeout(() => {
        window.location.href = `/virtual-classroom/${classData.id}`;
    }, 1000);
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
    // You can implement a toast notification here
    alert(message); // Temporary simple alert
}

// Helper function to create modal
function createModal(title, content, showJoinButton = false) {
    const modalHTML = `
        <div class="modal fade" id="classDetailsModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        ${showJoinButton ? 
                            `<button type="button" class="btn btn-primary join-class-btn">Join Class</button>` 
                            : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('classDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('classDetailsModal'));
    modal.show();
}

// Utility Functions
function formatDateTime(dateTimeStr) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    };
    return new Date(dateTimeStr).toLocaleDateString('en-US', options);
}

function calculateTimeRemaining(startDateTime) {
    const start = new Date(startDateTime);
    const now = new Date();
    const diff = start - now;

    if (diff <= 0) return 'Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
}

// Update time remaining every minute
setInterval(() => {
    renderClassesTable(liveClassData);
}, 60000);

// Handle Material Upload
document.querySelector('.upload-btn')?.addEventListener('click', () => {
    handleMaterialUpload();
});

function handleMaterialUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.ppt,.pptx';
    
    input.onchange = (e) => {
        const files = Array.from(e.target.files);
        uploadFiles(files);
    };
    
    input.click();
}

function uploadFiles(files) {
    // Here you would typically implement file upload logic
    console.log('Uploading files:', files);
    // Show upload progress
    files.forEach(file => {
        console.log(`Uploading: ${file.name}`);
    });
}

// Add sorting functionality to table headers
document.querySelectorAll('th').forEach(header => {
    header.addEventListener('click', () => {
        const column = header.textContent.toLowerCase();
        sortTable(column);
    });
});

function sortTable(column) {
    const sortedData = [...liveClassData].sort((a, b) => {
        if (column === 'registered students') {
            return b.registeredStudents - a.registeredStudents;
        }
        if (column === 'start date & time') {
            return new Date(b.startDateTime) - new Date(a.startDateTime);
        }
        return a[column] > b[column] ? 1 : -1;
    });
    
    renderClassesTable(sortedData);
}

// Poll and Quiz Functions
function createPoll() {
    // Implementation for creating a poll
    console.log('Creating new poll...');
}

function createQuiz() {
    // Implementation for creating a quiz
    console.log('Creating new quiz...');
}

// Event Listeners for Poll and Quiz
document.getElementById('create-poll-btn')?.addEventListener('click', createPoll);
document.getElementById('create-quiz-btn')?.addEventListener('click', createQuiz);