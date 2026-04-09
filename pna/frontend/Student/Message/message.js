document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const messageItems = document.querySelectorAll('.message-item');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const searchInput = document.querySelector('.search-box input');

    // تحديد الرسالة النشطة
    messageItems.forEach(item => {
        item.addEventListener('click', () => {
            // إزالة الـ active class من جميع الرسائل
            messageItems.forEach(msg => msg.classList.remove('active'));
            // إضافة الـ active class للرسالة المحددة
            item.classList.add('active');
            
            // تحديث معلومات header المحادثة
            updateChatHeader(item);
        });
    });

    // إرسال رسالة جديدة
    function sendMessage(content) {
        if (!content.trim()) return;

        const currentTime = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        const messageHTML = `
            <div class="message sent">
                <div class="message-content">
                    <p>${content}</p>
                    <span class="message-time">${currentTime}</span>
                </div>
            </div>
        `;

        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // معالجة إرسال الرسالة
    sendButton.addEventListener('click', () => {
        const content = chatInput.value;
        sendMessage(content);
        chatInput.value = '';
    });

    // إرسال بضغط Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const content = chatInput.value;
            sendMessage(content);
            chatInput.value = '';
        }
    });

    // تحديث header المحادثة
    function updateChatHeader(selectedItem) {
        const userName = selectedItem.querySelector('h4').textContent;
        const userImage = selectedItem.querySelector('.avatar img').src;
        const status = selectedItem.querySelector('.status').classList.contains('online') ? 'Online' : 'Offline';

        const chatHeader = document.querySelector('.chat-user-info');
        chatHeader.querySelector('img').src = userImage;
        chatHeader.querySelector('h3').textContent = userName;
        chatHeader.querySelector('.status-text').textContent = status;
    }

    // البحث في الرسائل
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        messageItems.forEach(item => {
            const userName = item.querySelector('h4').textContent.toLowerCase();
            const messageText = item.querySelector('p').textContent.toLowerCase();
            
            if (userName.includes(searchTerm) || messageText.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // تأثيرات حركية للرسائل
    function addMessageAnimations() {
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(20px)';
        });

        let delay = 0;
        messages.forEach(message => {
            setTimeout(() => {
                message.style.transition = 'all 0.3s ease';
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';
            }, delay);
            delay += 100;
        });
    }

    // Emoji Button Functionality
    const emojiBtn = document.querySelector('.emoji-btn');
    if (emojiBtn) {
        emojiBtn.addEventListener('click', () => {
            // هنا يمكنك إضافة منطق emoji picker
            console.log('Emoji picker clicked');
        });
    }

    // Attachment Button Functionality
    const attachmentBtn = document.querySelector('.attachment-btn');
    if (attachmentBtn) {
        attachmentBtn.addEventListener('click', () => {
            // هنا يمكنك إضافة منطق رفع الملفات
            console.log('Attachment button clicked');
        });
    }

    // تفعيل التأثيرات الحركية عند تحميل الصفحة
    addMessageAnimations();
});

// إضافة تأثيرات التحميل
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
