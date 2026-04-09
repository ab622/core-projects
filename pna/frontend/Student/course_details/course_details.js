document.addEventListener('DOMContentLoaded', function() {
    // تحديد عناصر الفيديو والتفاعل
    const elements = {
        video: document.getElementById('courseVideo'),
        controls: {
            playPause: document.getElementById('playPause'),
            rewind10: document.getElementById('rewind10'),
            forward10: document.getElementById('forward10'),
            speed: document.getElementById('playbackSpeed'),
            volume: document.getElementById('volumeControl'),
            progress: document.getElementById('progressBar')
        },
        buttons: {
            like: document.getElementById('likeBtn'),
            save: document.getElementById('saveCourseBtn'),
            comment: document.getElementById('commentBtn'),
            view: document.getElementById('viewContentBtn'),
            download: document.getElementById('downloadContentBtn')
        },
        comment: {
            textarea: document.getElementById('commentTextarea'),
            section: document.getElementById('commentSection'),
            submit: document.getElementById('submitComment')
        }
    };

    // تحكم الفيديو المحسن
    if (elements.video && elements.controls.progress) {
        // تحديث شريط التقدم
        elements.video.addEventListener('timeupdate', () => {
            const progress = (elements.video.currentTime / elements.video.duration) * 100;
            elements.controls.progress.style.width = `${progress}%`;
        });

        // التحكم في مستوى الصوت
        if (elements.controls.volume) {
            elements.controls.volume.addEventListener('input', (e) => {
                elements.video.volume = e.target.value;
            });
        }
    }

    // تحسين أزرار التفاعل
    const buttonEffects = {
        like: {
            activeColor: '#ef4444',
            animation: 'heartBeat',
            duration: 300
        },
        save: {
            activeColor: '#059669',
            animation: 'bounce',
            duration: 300
        },
        download: {
            activeColor: '#3b82f6',
            animation: 'fa-bounce',
            duration: 1000
        }
    };

    // إضافة تأثيرات للأزرار
    Object.entries(elements.buttons).forEach(([key, button]) => {
        if (button) {
            const effect = buttonEffects[key];
            
            button.addEventListener('click', () => {
                button.classList.toggle('active');
                const icon = button.querySelector('i');
                
                if (icon && effect) {
                    if (button.classList.contains('active')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        icon.style.color = effect.activeColor;
                        icon.style.animation = `${effect.animation} ${effect.duration}ms ease-in-out`;
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        icon.style.color = '#64748b';
                        icon.style.animation = 'none';
                    }
                }
            });

            // تحسين تأثير Hover
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = `0 5px 15px ${effect?.activeColor || 'rgba(0,0,0,0.1)'}33`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
        }
    });

    // تحسين وظيفة التعليق
    if (elements.comment.textarea && elements.comment.submit) {
        elements.comment.submit.addEventListener('click', () => {
            const comment = elements.comment.textarea.value.trim();
            if (comment) {
                // إظهار تأثير التحميل
                elements.comment.submit.disabled = true;
                elements.comment.submit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

                // محاكاة إرسال التعليق
                setTimeout(() => {
                    elements.comment.textarea.value = '';
                    elements.comment.submit.disabled = false;
                    elements.comment.submit.innerHTML = '<i class="far fa-paper-plane"></i> Submit';
                    
                    // إظهار رسالة نجاح
                    showNotification('Comment submitted successfully!', 'success');
                }, 1000);
            }
        });
    }

    // دالة إظهار الإشعارات
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 100);
    }
});
