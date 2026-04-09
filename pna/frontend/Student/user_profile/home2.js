document.addEventListener('DOMContentLoaded', function() {
    // Course Data
    const courses = [
        {
            icon: '🎨',
            title: 'Learn Figma',
            author: 'Christopher Morgan',
            duration: '6h 30min',
            rating: 4.9,
            category: 'design',
            popularity: 95,
            date: '2024-03-01'
        },
        {
            icon: '📷',
            title: 'Analog photography',
            author: 'Gordon Norman',
            duration: '3h 15min',
            rating: 4.7,
            category: 'photography',
            popularity: 85,
            date: '2024-03-10'
        },
        {
            icon: '📱',
            title: 'Master Instagram',
            author: 'Sophie Gill',
            duration: '7h 40min',
            rating: 4.6,
            category: 'social',
            popularity: 90,
            date: '2024-03-15'
        },
        {
            icon: '✏️',
            title: 'Basics of drawing',
            author: 'Jean Tate',
            duration: '11h 30min',
            rating: 4.8,
            category: 'art',
            popularity: 88,
            date: '2024-03-05'
        },
        {
            icon: '🎨',
            title: 'Photoshop - Essence',
            author: 'David Green',
            duration: '5h 35min',
            rating: 4.7,
            category: 'design',
            popularity: 92,
            date: '2024-03-12'
        }
    ];

    // تحسين عرض الكورسات مع إضافة تأثيرات حركية
    function renderCourses(coursesToRender) {
        const courseList = document.querySelector('.course-list');
        courseList.innerHTML = '';
        
        coursesToRender.forEach((course, index) => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course-item';
            courseElement.style.animation = `slideUp 0.5s ease-out forwards ${index * 0.1}s`;
            
            courseElement.innerHTML = `
                <div class="course-icon">${course.icon}</div>
                <div class="course-info">
                    <h3>${course.title}</h3>
                    <p>by ${course.author}</p>
                </div>
                <div class="course-duration">
                    ${course.duration}
                </div>
                <div class="course-rating">
                    ${generateStars(course.rating)}
                    <span>${course.rating}</span>
                </div>
                <button class="view-btn">View course</button>
            `;
            courseList.appendChild(courseElement);
        });
    }

    // إضافة نجوم التقييم بشكل تفاعلي
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="bi bi-star-fill" style="color: gold;"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="bi bi-star-half" style="color: gold;"></i>';
        }
        return stars;
    }

    // تنفيذ الفلترة للكورسات
    document.querySelectorAll('.course-tabs .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            let filteredCourses = [...courses];
            switch(this.textContent) {
                case 'The Newest':
                    filteredCourses.sort((a, b) => new Date(b.date) - new Date(a.date));
                    break;
                case 'Top Rated':
                    filteredCourses.sort((a, b) => b.rating - a.rating);
                    break;
                case 'Most Popular':
                    filteredCourses.sort((a, b) => b.popularity - a.popularity);
                    break;
            }
            renderCourses(filteredCourses);
        });
    });

    // تحسين الرسم البياني
    const ctx = document.getElementById('learningChart').getContext('2d');
    let learningChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Learning Hours',
                data: [0, 1.5, 2.5, 2.5, 4, 3, 2],
                borderColor: '#209dd8',
                backgroundColor: 'rgba(32, 157, 216, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#209dd8',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        font: {
                            family: "'Segoe UI', sans-serif",
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Segoe UI', sans-serif",
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#000',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} hours`;
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });

    // تحديث بيانات الرسم البياني حسب الفترة
    const chartData = {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [0, 1.5, 2.5, 2.5, 4, 3, 2]
        },
        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [10, 15, 12, 18]
        },
        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [20, 25, 30, 35, 28, 32, 38, 40, 35, 38, 42, 45]
        }
    };

    document.querySelector('.period-select').addEventListener('change', function(e) {
        const period = e.target.value;
        learningChart.data.labels = chartData[period].labels;
        learningChart.data.datasets[0].data = chartData[period].data;
        learningChart.update();
    });

    // تفعيل الفلترة في إحصائيات التعلم
    document.querySelectorAll('.stats-nav span').forEach(span => {
        span.addEventListener('click', function() {
            document.querySelectorAll('.stats-nav span').forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            // هنا يمكن إضافة منطق لتحديث البيانات حسب النوع المختار
        });
    });

    // عرض الكورسات الأولية
    renderCourses(courses);
});