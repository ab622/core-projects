document.addEventListener('DOMContentLoaded', function() {
    // تحديد العناصر الأساسية
    const tabItems = document.querySelectorAll('.settings-tab-item');
    const contentSections = document.querySelectorAll('.settings-section');

    // إخفاء جميع الأقسام ما عدا القسم الأول
    contentSections.forEach((section, index) => {
        if (index === 0) {
            section.style.display = 'block';
            section.classList.add('active');
        } else {
            section.style.display = 'none';
            section.classList.remove('active');
        }
    });

    // تفعيل التاب الأول
    if (tabItems.length > 0) {
        tabItems[0].classList.add('active');
    }

    // إضافة مستمعي الأحداث للتابات
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            // إزالة الكلاس النشط من جميع التابات
            tabItems.forEach(item => {
                item.classList.remove('active');
            });

            // إضافة الكلاس النشط للتاب المحدد
            tab.classList.add('active');

            // إخفاء جميع الأقسام
            contentSections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });

            // إظهار القسم المطلوب
            const targetId = tab.getAttribute('data-tab');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                setTimeout(() => {
                    targetSection.classList.add('active');
                }, 50);
            }
        });
    });

    // تفعيل وظيفة رفع الصورة
    const uploadBtn = document.querySelector('.settings-btn-primary');
    const removeBtn = document.querySelector('.settings-btn-secondary');
    const profileImg = document.querySelector('.profile-avatar');

    if (uploadBtn && removeBtn && profileImg) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImg.src = e.target.result;
                }
                reader.readAsDataURL(e.target.files[0]);
            }
        });

        removeBtn.addEventListener('click', () => {
            profileImg.src = '/pna/frontend/assets/images/avatar-placeholder.png';
        });
    }

    // تفعيل التوجلز
    const toggles = document.querySelectorAll('.settings-switch input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.closest('.settings-toggle').querySelector('label');
            if (label) {
                console.log(`${label.textContent} is now ${this.checked ? 'enabled' : 'disabled'}`);
            }
        });
    });

    // تفعيل حفظ التغييرات
    const forms = document.querySelectorAll('.settings-form-group');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                console.log(`Field "${this.name || this.placeholder}" updated`);
            });
        });
    });
});
