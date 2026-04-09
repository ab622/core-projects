document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    const coursesGrid = document.querySelector('.courses-grid');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الـ active class من كل الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الـ active class للزر المضغوط
            button.classList.add('active');

            const filterValue = button.textContent.trim().toLowerCase();

            if (filterValue === 'all') {
                // إضافة class للعرض في صف واحد
                coursesGrid.classList.add('single-row');
                courseCards.forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                // إزالة class العرض في صف واحد
                coursesGrid.classList.remove('single-row');
                courseCards.forEach(card => {
                    const category = card.querySelector('.category-tag').textContent.trim().toLowerCase();
                    card.style.display = category === filterValue ? 'block' : 'none';
                });
            }
        });
    });

    // تفعيل العرض في صف واحد مبدئياً إذا كان All مختار
    if (document.querySelector('.filter-btn.active').textContent.trim().toLowerCase() === 'all') {
        coursesGrid.classList.add('single-row');
    }
});

// إضافة animation للـ fadeIn
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);