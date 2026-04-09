// Placeholder for additional JavaScript functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatList = document.getElementById('chat-list');
    const chatWindow = document.querySelector('.chat-window');
    const chatUserAvatar = document.querySelector('.chat-header-info .avatar img');
    const chatUserName = document.querySelector('.student-details h3');
    const chatUserStatus = document.querySelector('.online-status');
    const messagesContainer = document.getElementById('messages-container');
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const addGroupBtn = document.querySelector('.btn-add-group');
    const videoCallBtn = document.querySelector('.btn-video-call');
    const audioCallBtn = document.querySelector('.btn-audio-call');
    const voiceRecordBtn = document.getElementById('btn-voice-record');
    const attachImageBtn = document.getElementById('btn-attach-image');
    const attachFileBtn = document.getElementById('btn-attach-file');

    // Check for pre-selected student from other pages
    function initializeChatFromStorage() {
        const selectedStudent = localStorage.getItem('selectedChatStudent');
        if (selectedStudent) {
            const student = JSON.parse(selectedStudent);
            
            // Find or create chat list item
            let chatItem = document.querySelector(`.chat-list-item[data-student-id="${student.id}"]`);
            
            if (!chatItem) {
                // If no existing chat item, create a new one
                chatItem = document.createElement('div');
                chatItem.classList.add('chat-list-item');
                chatItem.dataset.studentId = student.id;
                chatItem.innerHTML = `
                    <div class="avatar">
                        <img src="${student.avatar}" alt="${student.name}">
                    </div>
                    <div class="chat-list-item-details">
                        <h3 class="chat-list-item-name">${student.name}</h3>
                        <span class="status online">Online</span>
                    </div>
                `;
                chatList.appendChild(chatItem);
            }

            // Simulate click to open chat
            chatItem.click();

            // Clear the stored student
            localStorage.removeItem('selectedChatStudent');
        }
    }

    // Call initialization on page load
    initializeChatFromStorage();

    // Chat Storage Object
    const chatStorage = {
        currentChat: null,
        chats: {},

        // Initialize or get chat messages
        getChat(studentId) {
            if (!this.chats[studentId]) {
                this.chats[studentId] = {
                    messages: [],
                    avatar: '',
                    name: '',
                    status: ''
                };
            }
            return this.chats[studentId];
        },

        // Add message to specific chat
        addMessage(studentId, messageElement) {
            const chat = this.getChat(studentId);
            chat.messages.push(messageElement.outerHTML);
        },

        // Restore chat messages
        restoreChat(studentId) {
            const chat = this.getChat(studentId);
            messagesContainer.innerHTML = chat.messages.join('');
        },

        // Update current chat info
        updateChatInfo(studentId, avatar, name, status) {
            const chat = this.getChat(studentId);
            chat.avatar = avatar;
            chat.name = name;
            chat.status = status;
        }
    };

    // Utility function to create modal
    function createModal(title, content, buttons) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) existingModal.remove();

        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            z-index: 1000;
            width: 400px;
            max-width: 90%;
            padding: 20px;
            text-align: center;
        `;

        // Modal header
        const header = document.createElement('h2');
        header.textContent = title;
        header.style.marginBottom = '20px';
        modal.appendChild(header);

        // Modal content
        if (content) {
            const contentDiv = document.createElement('div');
            contentDiv.textContent = content;
            contentDiv.style.marginBottom = '20px';
            modal.appendChild(contentDiv);
        }

        // Modal buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'center';
        buttonsContainer.style.gap = '10px';

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                padding: 10px 20px;
                border: none;
                border-radius: 25px;
                background-color: ${btn.color};
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            button.addEventListener('click', btn.onClick);
            buttonsContainer.appendChild(button);
        });

        modal.appendChild(buttonsContainer);
23
        // Overlay23333333333333333333333333333
        const overlay = document.createElement('div');78
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(5px);
            z-index: 999;
        `;
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });

        // Append to body
        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        return { modal, overlay };
    }

    // Utility function to create group modal
    function createGroupModal() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(5px);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Create modal container
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            width: 500px;
            max-width: 90%;
            padding: 25px;
            position: relative;
        `;

        // Modal content
        modal.innerHTML = `
            <h2 style="
                color: #209dd8;
                margin-bottom: 20px;
                text-align: center;
            ">Create New Group</h2>
            
            <div style="margin-bottom: 15px;">
                <label style="
                    display: block;
                    margin-bottom: 8px;
                    color: #333;
                ">Group Name</label>
                <input type="text" placeholder="Enter group name" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                ">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="
                    display: block;
                    margin-bottom: 8px;
                    color: #333;
                ">Add Members</label>
                <input type="text" placeholder="Search members" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                ">
            </div>
            
            <div style="
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
            ">
                <button id="create-group-btn" style="
                    background: #209dd8;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Create Group</button>
                
                <button id="cancel-group-btn" style="
                    background: #ff4757;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Cancel</button>
            </div>
        `;

        // Close modal functionality
        const closeModal = () => {
            overlay.remove();
        };

        // Create group button
        const createGroupBtn = modal.querySelector('#create-group-btn');
        createGroupBtn.addEventListener('click', () => {
            const groupName = modal.querySelector('input[placeholder="Enter group name"]').value;
            if (groupName.trim()) {
                // Simulate group creation
                const newGroupItem = document.createElement('div');
                newGroupItem.classList.add('chat-list-item');
                newGroupItem.innerHTML = `
                    <div class="avatar">
                        <img src="https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png" alt="Group">
                        <div class="status online"></div>
                    </div>
                    <div class="chat-list-item-details">
                        <div class="chat-list-item-name">${groupName}</div>
                        <div class="chat-list-item-preview">Group created</div>
                    </div>
                `;
                
                chatList.appendChild(newGroupItem);
                closeModal();
            } else {
                alert('Please enter a group name');
            }
        });

        // Cancel button
        const cancelBtn = modal.querySelector('#cancel-group-btn');
        cancelBtn.addEventListener('click', closeModal);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // Append to body
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // Utility function to create call modal
    function createCallModal(type) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.call-modal');
        if (existingModal) existingModal.remove();

        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'call-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #209dd8, #1a7fb0);
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.2);
            z-index: 1000;
            width: 500px;
            max-width: 90%;
            padding: 30px;
            text-align: center;
            color: white;
            transition: all 0.3s ease;
        `;

        // Call header
        const header = document.createElement('h2');
        header.textContent = type === 'video' ? 'Video Call' : 'Audio Call';
        header.style.cssText = `
            margin-bottom: 20px;
            font-size: 24px;
        `;
        modal.appendChild(header);

        // User info
        const userInfo = document.createElement('div');
        userInfo.innerHTML = `
            <img src="${chatUserAvatar.src}" alt="User" style="
                width: 120px;
                height: 120px;
                border-radius: 50%;
                border: 4px solid white;
                margin-bottom: 15px;
            ">
            <h3>${chatUserName.textContent}</h3>
            <p class="call-status">Calling...</p>
        `;
        modal.appendChild(userInfo);

        // Call controls
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        `;

        // Mute button
        const muteBtn = document.createElement('button');
        muteBtn.innerHTML = `<i class="fas fa-microphone"></i>`;
        muteBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        muteBtn.addEventListener('click', () => {
            muteBtn.classList.toggle('muted');
            muteBtn.style.background = muteBtn.classList.contains('muted') 
                ? 'rgba(255,0,0,0.5)' 
                : 'rgba(255,255,255,0.2)';
        });

        // End call button
        const endCallBtn = document.createElement('button');
        endCallBtn.innerHTML = `<i class="fas fa-phone-slash"></i>`;
        endCallBtn.style.cssText = `
            background: rgba(255,0,0,0.7);
            border: none;
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        endCallBtn.addEventListener('click', () => {
            modal.remove();
            document.querySelector('.call-modal-overlay').remove();
        });

        controlsContainer.appendChild(muteBtn);
        controlsContainer.appendChild(endCallBtn);
        modal.appendChild(controlsContainer);

        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'call-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
            z-index: 999;
        `;
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });

        // Append to body
        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // Simulate call connection
        setTimeout(() => {
            const statusEl = modal.querySelector('.call-status');
            if (statusEl) statusEl.textContent = 'Connected';
        }, 2000);

        return { modal, overlay };
    }

    // Voice Recording and Playback Functionality
    function createVoiceRecordModal() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(5px);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Create modal container
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            width: 400px;
            max-width: 90%;
            padding: 25px;
            text-align: center;
        `;

        // Voice recording UI
        modal.innerHTML = `
            <h2 style="color: #209dd8; margin-bottom: 20px;">Voice Message</h2>
            
            <div id="voice-record-container" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            ">
                <div id="voice-timer" style="
                    font-size: 24px;
                    color: #333;
                    margin-bottom: 15px;
                ">00:00</div>
                
                <div style="display: flex; gap: 15px;">
                    <button id="start-record-btn" style="
                        background: #209dd8;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 30px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-microphone"></i> Start Recording
                    </button>
                    
                    <button id="stop-record-btn" style="
                        background: #ff4757;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 30px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: none;
                    ">
                        <i class="fas fa-stop"></i> Stop Recording
                    </button>
                </div>
                
                <div id="record-controls" style="
                    display: none;
                    gap: 15px;
                    margin-top: 15px;
                ">
                    <button id="send-voice-btn" style="
                        background: #2ecc71;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 30px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-paper-plane"></i> Send
                    </button>
                    
                    <button id="cancel-voice-btn" style="
                        background: #ff4757;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 30px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;

        // Close modal functionality
        const closeModal = () => {
            overlay.remove();
        };

        // Voice recording logic
        let mediaRecorder;
        let audioChunks = [];
        let recordingTimer;
        let recordingTime = 0;
        let audioBlob = null;

        const timerDisplay = modal.querySelector('#voice-timer');
        const startRecordBtn = modal.querySelector('#start-record-btn');
        const stopRecordBtn = modal.querySelector('#stop-record-btn');
        const recordControls = modal.querySelector('#record-controls');
        const sendVoiceBtn = modal.querySelector('#send-voice-btn');
        const cancelVoiceBtn = modal.querySelector('#cancel-voice-btn');

        // Start recording
        startRecordBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                };

                mediaRecorder.start();

                // Start timer
                recordingTime = 0;
                recordingTimer = setInterval(() => {
                    recordingTime++;
                    const minutes = Math.floor(recordingTime / 60);
                    const seconds = recordingTime % 60;
                    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }, 1000);

                // UI updates
                startRecordBtn.style.display = 'none';
                stopRecordBtn.style.display = 'inline-block';
            } catch (err) {
                console.error('Error accessing microphone:', err);
                alert('Unable to access microphone. Please check permissions.');
            }
        });

        // Stop recording
        stopRecordBtn.addEventListener('click', () => {
            mediaRecorder.stop();
            clearInterval(recordingTimer);

            // UI updates
            stopRecordBtn.style.display = 'none';
            recordControls.style.display = 'flex';
        });

        // Send voice message
        sendVoiceBtn.addEventListener('click', () => {
            if (audioBlob) {
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Create voice message element
                const voiceMessageElement = document.createElement('div');
                voiceMessageElement.classList.add('message', 'sent', 'voice-message');
                voiceMessageElement.innerHTML = `
                    <div class="message-content">
                        <div class="voice-message-player" style="
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            background: #f0f0f0;
                            padding: 10px;
                            border-radius: 20px;
                        ">
                            <button class="play-pause-btn" style="
                                background: #209dd8;
                                color: white;
                                border: none;
                                width: 40px;
                                height: 40px;
                                border-radius: 50%;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                cursor: pointer;
                            ">
                                <i class="fas fa-play"></i>
                            </button>
                            <div class="audio-progress" style="
                                flex-grow: 1;
                                height: 5px;
                                background: #ddd;
                                border-radius: 5px;
                                position: relative;
                            ">
                                <div class="progress-bar" style="
                                    width: 0;
                                    height: 100%;
                                    background: #209dd8;
                                    border-radius: 5px;
                                "></div>
                            </div>
                            <span class="duration">00:00</span>
                        </div>
                        <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                `;

                // Audio player logic
                const audio = new Audio(audioUrl);
                const playPauseBtn = voiceMessageElement.querySelector('.play-pause-btn');
                const progressBar = voiceMessageElement.querySelector('.progress-bar');
                const durationSpan = voiceMessageElement.querySelector('.duration');

                playPauseBtn.addEventListener('click', () => {
                    if (audio.paused) {
                        audio.play();
                        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    } else {
                        audio.pause();
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                });

                audio.addEventListener('timeupdate', () => {
                    const progress = (audio.currentTime / audio.duration) * 100;
                    progressBar.style.width = `${progress}%`;
                    
                    const minutes = Math.floor(audio.currentTime / 60);
                    const seconds = Math.floor(audio.currentTime % 60);
                    durationSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                });

                audio.addEventListener('ended', () => {
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    progressBar.style.width = '0';
                    durationSpan.textContent = '00:00';
                });
                
                messagesContainer.appendChild(voiceMessageElement);
                chatStorage.addMessage(chatStorage.currentChat, voiceMessageElement);
                closeModal();
            }
        });

        // Cancel recording
        cancelVoiceBtn.addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
            clearInterval(recordingTimer);
            audioChunks = [];
            closeModal();
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // Append to body
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // Chat List Item Selection
    chatList.addEventListener('click', (e) => {
        const selectedItem = e.target.closest('.chat-list-item');
        if (selectedItem) {
            // Remove active class from all items
            document.querySelectorAll('.chat-list-item').forEach(item => {
                item.classList.remove('active');
            });

            // Add active class to selected item
            selectedItem.classList.add('active');

            // Get student details
            const studentId = selectedItem.dataset.studentId;
            const avatar = selectedItem.querySelector('.avatar img').src;
            const name = selectedItem.querySelector('.chat-list-item-name').textContent;
            const status = selectedItem.querySelector('.status').classList.contains('online') ? 'Online' : 'Offline';

            // Update chat window header
            chatUserAvatar.src = avatar;
            chatUserName.textContent = name;
            chatUserStatus.textContent = status;

            // Store current chat info
            chatStorage.currentChat = studentId;
            chatStorage.updateChatInfo(studentId, avatar, name, status);

            // Restore previous messages or clear
            chatStorage.restoreChat(studentId);
        }
    });

    // Send Message Functionality
    sendMessageBtn.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText && chatStorage.currentChat) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'sent');
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${messageText}</p>
                    <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            `;
            
            messagesContainer.appendChild(messageElement);
            chatStorage.addMessage(chatStorage.currentChat, messageElement);
            
            messageInput.value = '';
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });

    // Allow sending message by pressing Enter
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    // Add Group Functionality
    addGroupBtn.addEventListener('click', createGroupModal);

    // Video Call Functionality
    videoCallBtn.addEventListener('click', () => {
        createCallModal('video');
    });

    // Audio Call Functionality
    audioCallBtn.addEventListener('click', () => {
        createCallModal('audio');
    });

    // Voice Record Functionality
    voiceRecordBtn.addEventListener('click', createVoiceRecordModal);

    // Attachment and Emoji Buttons
    document.getElementById('btn-attach-file').addEventListener('click', () => {
        alert('File attachment functionality will be implemented soon.');
    });

    document.getElementById('btn-attach-image').addEventListener('click', () => {
        alert('Image attachment functionality will be implemented soon.');
    });

    document.getElementById('btn-emoji').addEventListener('click', () => {
        alert('Emoji selection functionality will be implemented soon.');
    });
});
