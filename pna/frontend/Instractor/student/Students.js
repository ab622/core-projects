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
// DOM Elements
const modal = document.getElementById('addStudentModal');
const addBtn = document.querySelector('.add-student-btn');
const closeBtn = document.querySelector('.close');

// Modal Functions
function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners
addBtn.addEventListener('click', openModal);

closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Table Functions
function createStudentRow(student) {
    return `
        <tr>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.id}</td>
            <td>${student.level}</td>
            <td><span class="status ${student.status.toLowerCase()}">${student.status}</span></td>
            <td>
                <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `;
}

// Search Function
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('#students-list tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Filter Functions
const statusFilter = document.querySelector('.filter-select');
statusFilter.addEventListener('change', (e) => {
    const filterValue = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('#students-list tr');
    
    tableRows.forEach(row => {
        const status = row.querySelector('.status').textContent.toLowerCase();
        row.style.display = (filterValue === 'all' || status === filterValue) ? '' : 'none';
    });
});

// Add Student Form Submission
document.getElementById('addStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(this);
    const studentData = {};
    
    formData.forEach((value, key) => {
        studentData[key] = value;
    });
    
    // Here you would typically send this data to your backend
    console.log('New student data:', studentData);
    
    // Close the modal and reset form
    closeModal();
    this.reset();
    
    // Show success message (you can customize this)
    alert('Student added successfully!');
});

// Error Handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Loading States
function setLoading(isLoading) {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (isLoading) {
        loadingOverlay?.classList.add('active');
    } else {
        loadingOverlay?.classList.remove('active');
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // أي كود تهيئة إضافي يمكن إضافته هنا
});
