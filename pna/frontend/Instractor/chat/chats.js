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
document.addEventListener('DOMContentLoaded', () => {
    // Chat List Interaction
    const chatList = document.getElementById('chat-list');
    const chatListItems = chatList.querySelectorAll('.chat-list-item');
    const chatWindow = document.querySelector('.chat-window');
    const chatUserAvatar = document.getElementById('chat-user-avatar');
    const chatUserName = document.getElementById('chat-user-name');
    const chatUserStatus = document.getElementById('chat-user-status');
    const messagesContainer = document.getElementById('messages-container');

    // Chat List Item Selection
    chatListItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            chatListItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Update chat window header
            const studentName = item.querySelector('.chat-list-item-name').textContent;
            const studentAvatar = item.querySelector('.chat-list-item-avatar').src;
            
            chatUserAvatar.src = studentAvatar;
            chatUserName.textContent = studentName;
            chatUserStatus.textContent = 'Online'; // This could be dynamic in a real app

            // Load messages for this student (placeholder)
            loadStudentMessages(item.dataset.studentId);
        });
    });

    // Search Functionality
    const chatSearchInput = document.getElementById('chat-search-input');
    chatSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        chatListItems.forEach(item => {
            const name = item.querySelector('.chat-list-item-name').textContent.toLowerCase();
            const preview = item.querySelector('.chat-list-item-preview').textContent.toLowerCase();
            item.style.display = (name.includes(searchTerm) || preview.includes(searchTerm)) ? 'flex' : 'none';
        });
    });

    // Filter Functionality
    const statusFilter = document.getElementById('status-filter');
    const timeFilter = document.getElementById('time-filter');

    [statusFilter, timeFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    function applyFilters() {
        const statusValue = statusFilter.value;
        const timeValue = timeFilter.value;

        chatListItems.forEach(item => {
            const isUnread = item.querySelector('.unread-badge');
            const timestamp = item.querySelector('.timestamp').textContent;

            let statusMatch = !statusValue || 
                (statusValue === 'unread' && isUnread) || 
                (statusValue === 'read' && !isUnread);

            let timeMatch = !timeValue || checkTimeFilter(timestamp, timeValue);

            item.style.display = (statusMatch && timeMatch) ? 'flex' : 'none';
        });
    }

    function checkTimeFilter(timestamp, filter) {
        const now = new Date();
        const messageDate = parseTimestamp(timestamp);

        switch(filter) {
            case 'today':
                return isSameDay(now, messageDate);
            case 'week':
                return isWithinWeek(now, messageDate);
            case 'month':
                return isWithinMonth(now, messageDate);
            default:
                return true;
        }
    }

    function parseTimestamp(timestamp) {
        // Simple timestamp parsing
        if (timestamp.includes('Today')) return new Date();
        if (timestamp.includes('Yesterday')) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday;
        }
        return new Date(timestamp);
    }

    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    function isWithinWeek(date1, date2) {
        const oneWeekAgo = new Date(date1);
        oneWeekAgo.setDate(date1.getDate() - 7);
        return date2 >= oneWeekAgo && date2 <= date1;
    }

    function isWithinMonth(date1, date2) {
        const oneMonthAgo = new Date(date1);
        oneMonthAgo.setMonth(date1.getMonth() - 1);
        return date2 >= oneMonthAgo && date2 <= date1;
    }

    // Message Input Functionality
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const typingIndicator = document.getElementById('typing-indicator');

    messageInput.addEventListener('input', () => {
        typingIndicator.style.display = messageInput.value.length > 0 ? 'block' : 'none';
    });

    sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (!messageText) return;

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sent');
        messageElement.innerHTML = `
            <div class="message-content">
                ${messageText}
            </div>
        `;

        // Append to messages container
        messagesContainer.appendChild(messageElement);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Clear input
        messageInput.value = '';
        typingIndicator.style.display = 'none';
    }

    // File and Image Attachment
    const attachFileBtn = document.getElementById('btn-attach-file');
    const attachImageBtn = document.getElementById('btn-attach-image');

    attachFileBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.click();
    });

    attachImageBtn.addEventListener('click', () => {
        const imageInput = document.createElement('input');
        imageInput.type = 'file';
        imageInput.accept = 'image/*';
        imageInput.click();
    });

    // Student Notes Modal
    const studentNotesModal = document.getElementById('student-notes-modal');
    const btnStudentNotes = document.getElementById('btn-student-notes');
    const btnCloseNotesModal = document.getElementById('btn-close-notes-modal');
    const btnSaveNotes = document.getElementById('btn-save-notes');
    const studentNotesTextarea = document.getElementById('student-notes-textarea');

    btnStudentNotes.addEventListener('click', () => {
        studentNotesModal.style.display = 'block';
    });

    btnCloseNotesModal.addEventListener('click', () => {
        studentNotesModal.style.display = 'none';
    });

    btnSaveNotes.addEventListener('click', () => {
        const notes = studentNotesTextarea.value.trim();
        if (notes) {
            // In a real app, this would save to backend
            alert('Notes saved successfully!');
            studentNotesModal.style.display = 'none';
        }
    });

    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target === studentNotesModal) {
            studentNotesModal.style.display = 'none';
        }
    });

    // End Chat Functionality
    const btnEndChat = document.getElementById('btn-end-chat');
    btnEndChat.addEventListener('click', () => {
        const activeChat = document.querySelector('.chat-list-item.active');
        if (activeChat) {
            // Confirm before ending chat
            if (confirm('Are you sure you want to end this chat?')) {
                // In a real app, this would update chat status
                activeChat.remove();
                resetChatWindow();
            }
        }
    });

    function resetChatWindow() {
        chatUserAvatar.src = '/pna/frontend/assets/images/profile-placeholder.jpg';
        chatUserName.textContent = 'Select a Conversation';
        chatUserStatus.textContent = 'No conversation selected';
        messagesContainer.innerHTML = '';
    }

    // Placeholder for loading student messages
    function loadStudentMessages(studentId) {
        // In a real app, this would fetch messages from a backend
        messagesContainer.innerHTML = `
            <div class="message received">
                <div class="message-content">
                    Hey, can we discuss the assignment?
                </div>
            </div>
            <div class="message sent">
                <div class="message-content">
                    Sure, what specific questions do you have?
                </div>
            </div>
        `;
    }
});
