document.addEventListener('DOMContentLoaded', function() {
    // الحصول على جميع بطاقات الشهادات
    const certificateCards = document.querySelectorAll('.certificate-card');

    // إضافة تأثيرات حركية للبطاقات
    certificateCards.forEach((card, index) => {
        // تأخير ظهور كل بطاقة
        card.style.animationDelay = `${index * 0.1}s`;

        // إضافة مستمعي الأحداث للأزرار
        const viewBtn = card.querySelector('.view-btn');
        const downloadBtn = card.querySelector('.download-btn');

        // معالج حدث عرض الشهادة
        viewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // الحصول على معرف الشهادة
            const certId = card.querySelector('.certificate-id').textContent.split(': ')[1];
            viewCertificate(certId);
        });

        // معالج حدث تحميل الشهادة
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const certId = card.querySelector('.certificate-id').textContent.split(': ')[1];
            downloadCertificate(certId);
        });
    });

    // دالة عرض الشهادة
    function viewCertificate(certId) {
        // إنشاء modal لعرض الشهادة
        const modal = document.createElement('div');
        modal.className = 'certificate-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="path-to-full-certificate/${certId}.jpg" alt="Certificate">
            </div>
        `;

        // إضافة Modal للصفحة
        document.body.appendChild(modal);

        // إضافة CSS للـ modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        modal.querySelector('.modal-content').style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            position: relative;
        `;

        modal.querySelector('.close-modal').style.cssText = `
            position: absolute;
            right: 15px;
            top: 10px;
            font-size: 24px;
            cursor: pointer;
            color: #333;
        `;

        // إغلاق Modal
        modal.querySelector('.close-modal').onclick = function() {
            modal.remove();
        };

        // إغلاق Modal عند النقر خارجه
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    // دالة تحميل الشهادة
    function downloadCertificate(certId) {
        // هنا يمكنك إضافة منطق التحميل الفعلي
        console.log(`Downloading certificate: ${certId}`);
        
        // مثال على التحميل
        const link = document.createElement('a');
        link.href = `path-to-certificates/${certId}.pdf`;
        link.download = `Certificate-${certId}.pdf`;
        
        // محاكاة التحميل
        const downloadingToast = showToast('Downloading certificate...', 'info');
        
        // في الحالة الفعلية، ستحتاج إلى التحقق من اكتمال التحميل
        setTimeout(() => {
            downloadingToast.remove();
            showToast('Certificate downloaded successfully!', 'success');
        }, 2000);
    }

    // دالة إظهار رسائل التنبيه
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        // إزالة التنبيه تلقائياً
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        return toast;
    }

    // إضافة CSS للحركات
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
