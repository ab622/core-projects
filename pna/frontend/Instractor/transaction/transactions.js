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
// Local transactions data
let transactionsData = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    fetchTransactions();
    setupEventListeners();
    initializeRevenueChart();
    setupModalInteractions();
    initProgressBar();
});

// Fetch transactions
async function fetchTransactions() {
    try {
        // Simulated transaction data - replace with actual API call
        transactionsData = [
            { id: 'T001', date: '2024-01-15', amount: 250, status: 'Completed', studentName: 'Ahmed Hassan' },
            { id: 'T002', date: '2024-01-16', amount: 350, status: 'Pending', studentName: 'Fatima Ali' },
            { id: 'T003', date: '2024-01-17', amount: 200, status: 'Failed', studentName: 'Omar Mohammed' },
            // Add more transactions to demonstrate scrolling
            { id: 'T004', date: '2024-01-18', amount: 275, status: 'Completed', studentName: 'Layla Ibrahim' },
            { id: 'T005', date: '2024-01-19', amount: 425, status: 'Pending', studentName: 'Youssef Ahmed' },
            { id: 'T006', date: '2024-01-20', amount: 180, status: 'Completed', studentName: 'Nadia Saleh' },
            { id: 'T007', date: '2024-01-21', amount: 300, status: 'Failed', studentName: 'Kareem Hassan' },
            { id: 'T008', date: '2024-01-22', amount: 375, status: 'Pending', studentName: 'Amira Mohammed' },
            { id: 'T009', date: '2024-01-23', amount: 225, status: 'Completed', studentName: 'Zain Ali' },
            { id: 'T010', date: '2024-01-24', amount: 450, status: 'Pending', studentName: 'Sara Ibrahim' }
        ];

        const transactionsBody = document.getElementById('transactions-body');
        transactionsBody.innerHTML = ''; // Clear existing rows

        transactionsData.forEach(transaction => {
            const row = document.createElement('tr');
            
            // Status color mapping
            const statusColors = {
                'Completed': 'green',
                'Pending': 'orange',
                'Failed': 'red'
            };

            row.innerHTML = `
                <td>
                    <input type="checkbox" class="transaction-checkbox" data-id="${transaction.id}">
                </td>
                <td>${transaction.id}</td>
                <td>${transaction.date}</td>
                <td>$${transaction.amount}</td>
                <td>
                    <span class="status-badge" style="color: ${statusColors[transaction.status] || 'gray'}">
                        ${transaction.status}
                    </span>
                </td>
                <td>
                    <button class="action-btn view-details" data-id="${transaction.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;

            transactionsBody.appendChild(row);
        });

        // Update total revenue calculations
        const totalRevenue = transactionsData.reduce((sum, t) => sum + t.amount, 0);
        const completedPayouts = transactionsData.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0);
        const pendingPayouts = transactionsData.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);

        document.querySelector('.overview-card:nth-child(1) .overview-card-amount').textContent = `$${totalRevenue}`;
        document.querySelector('.overview-card:nth-child(2) .overview-card-amount').textContent = `$${pendingPayouts}`;
        document.querySelector('.overview-card:nth-child(3) .overview-card-amount').textContent = `$${completedPayouts}`;

    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

// Render transactions table
function renderTransactionsTable() {
    const tableBody = document.getElementById('transactions-list');
    tableBody.innerHTML = '';

    transactionsData.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="transaction-checkbox" data-id="${transaction.id}"></td>
            <td>${transaction.id}</td>
            <td>${transaction.studentName}</td>
            <td>$${transaction.amount}</td>
            <td>${transaction.date}</td>
            <td>${transaction.method}</td>
            <td><span class="status-badge ${transaction.status}">${transaction.status}</span></td>
            <td>
                <button class="action-btn view-details" data-id="${transaction.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update overview stats
function updateOverviewStats() {
    const totalRevenue = transactionsData.reduce((sum, t) => sum + t.amount, 0);
    const pendingPayouts = transactionsData.filter(t => t.status === 'pending')
                                           .reduce((sum, t) => sum + t.amount, 0);
    const completedPayouts = transactionsData.filter(t => t.status === 'completed')
                                             .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById('total-revenue-amount').textContent = `$${totalRevenue}`;
    document.getElementById('pending-payouts-amount').textContent = `$${pendingPayouts}`;
    document.getElementById('completed-payouts-amount').textContent = `$${completedPayouts}`;
}

// Setup event listeners
function setupEventListeners() {
    // Search and filter
    document.getElementById('search-input').addEventListener('input', filterTransactions);
    document.getElementById('status-filter').addEventListener('change', filterTransactions);
    
    // Export CSV
    document.getElementById('bulk-export-btn').addEventListener('click', exportToCSV);
    
    // Update transaction status
    document.getElementById('bulk-update-btn').addEventListener('click', () => {
        openModal('bulk-update-modal');
    });
    
    // View transaction details
    document.addEventListener('click', (e) => {
        if (e.target.closest('.view-details')) {
            const transactionId = e.target.closest('.view-details').dataset.id;
            showTransactionDetails(transactionId);
        }
    });
}

// Filter transactions
function filterTransactions() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;

    const filteredTransactions = transactionsData.filter(transaction => {
        const matchesSearch = transaction.studentName.toLowerCase().includes(searchTerm) ||
                               transaction.id.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || transaction.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    renderFilteredTransactions(filteredTransactions);
}

// Render filtered transactions
function renderFilteredTransactions(filteredTransactions) {
    const tableBody = document.getElementById('transactions-list');
    tableBody.innerHTML = '';

    filteredTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="transaction-checkbox" data-id="${transaction.id}"></td>
            <td>${transaction.id}</td>
            <td>${transaction.studentName}</td>
            <td>$${transaction.amount}</td>
            <td>${transaction.date}</td>
            <td>${transaction.method}</td>
            <td><span class="status-badge ${transaction.status}">${transaction.status}</span></td>
            <td>
                <button class="action-btn view-details" data-id="${transaction.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Export to CSV
function exportToCSV() {
    const selectedTransactions = transactionsData.filter(t => 
        document.querySelector(`input.transaction-checkbox[data-id="${t.id}"]:checked`)
    );

    let csvContent = "Transaction ID,Student Name,Amount,Date,Payment Method,Status\n";
    selectedTransactions.forEach(t => {
        csvContent += `${t.id},${t.studentName},${t.amount},${t.date},${t.method},${t.status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Show transaction details
function showTransactionDetails(transactionId) {
    const transaction = transactionsData.find(t => t.id === transactionId);
    const detailsContent = document.getElementById('transaction-details-content');
    
    detailsContent.innerHTML = `
        <div class="transaction-details">
            <p><strong>Transaction ID:</strong> ${transaction.id}</p>
            <p><strong>Student Name:</strong> ${transaction.studentName}</p>
            <p><strong>Amount:</strong> $${transaction.amount}</p>
            <p><strong>Date:</strong> ${transaction.date}</p>
            <p><strong>Payment Method:</strong> ${transaction.method}</p>
            <p><strong>Status:</strong> <span class="status-badge ${transaction.status}">${transaction.status}</span></p>
        </div>
    `;

    openModal('transaction-details-modal');
}

// Initialize revenue chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenue-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Revenue',
                data: [5000, 7500, 6200, 8000, 7000, 9000],
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                borderWidth: 2.7,
                fill: true,
                tension: 0.4,
                pointRadius: 5.5,
                pointBackgroundColor: '#2196F3',
                pointHoverRadius: 7.5,
                pointHoverBackgroundColor: '#1565c0',
                pointHoverBorderWidth: 2,
                pointHoverBorderColor: 'white'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 9
                        },
                        callback: function(value) {
                            return '$' + (value/1000) + 'K';
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)',
                        borderDash: [4, 4]
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 9
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    cornerRadius: 5,
                    padding: 10,
                    boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                    callbacks: {
                        title: function(context) {
                            return context[0].label + ' Revenue';
                        },
                        label: function(context) {
                            return 'Total Revenue: $' + context.parsed.y;
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                intersect: false
            },
            animation: {
                duration: 900,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Progress Bar Functionality
function initProgressBar() {
    const progressContainer = document.querySelector('.page-progress-container');
    const progressBar = document.querySelector('.page-progress-bar');
    
    // Show progress bar
    function showProgressBar() {
        progressContainer.classList.add('show');
    }
    
    // Hide progress bar
    function hideProgressBar() {
        progressContainer.classList.remove('show');
    }
    
    // Update progress based on scroll
    function updateProgressBar() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }

    // Event listeners
    window.addEventListener('scroll', () => {
        showProgressBar();
        updateProgressBar();
        
        // Hide progress bar after a short delay if not scrolling
        clearTimeout(window.progressBarTimeout);
        window.progressBarTimeout = setTimeout(hideProgressBar, 1000);
    });
}

// Modal utility functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Setup modal interactions
function setupModalInteractions() {
    // Close modal when clicking on close button or outside the modal
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Close modal when clicking outside of modal content
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Bulk update form submission
    const bulkUpdateForm = document.getElementById('bulk-update-form');
    if (bulkUpdateForm) {
        bulkUpdateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your update logic here
            closeModal('bulk-update-modal');
        });
    }
}

// Modal functionality
const modal = document.getElementById('bulk-update-modal');
const bulkUpdateBtn = document.getElementById('bulk-update-btn');
const closeModalBtn = document.querySelector('.close-modal');
const cancelUpdateBtn = document.getElementById('cancel-update');

function showModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

bulkUpdateBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);
cancelUpdateBtn.addEventListener('click', hideModal);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        hideModal();
    }
});

// Prevent form submission from closing modal
document.getElementById('bulk-update-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your update logic here
    hideModal();
});
