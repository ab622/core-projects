document.addEventListener('DOMContentLoaded', function() {
    // Particles Animation
    const particlesContainer = document.querySelector('.particles');
    const animations = ['float', 'floatReverse', 'float2', 'floatReverse2'];
    
    for (let i = 0; i < 200; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        
        const width = Math.random() * 15 + 10;
        const speed = Math.random() * 20 + 20;
        const delay = Math.random() * 10 * 0.1;
        const anim = animations[Math.floor(Math.random() * animations.length)];
        
        particle.style.width = width + 'px';
        particle.style.height = width + 'px';
        particle.style.left = (Math.random() * 100) + '%';
        particle.style.top = (Math.random() * 100) + '%';
        particle.style.animation = `${anim} ${speed}s ${delay}s infinite forwards`;
        
        particlesContainer.appendChild(particle);
    }

    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.querySelector('.toggle-password');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userType = document.querySelector('input[name="user_type"]:checked').value;

        console.log('Sending login request:', { email, userType });

        try {
            const response = await fetch('/pna/backend/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    user_type: userType
                })
            });

            const data = await response.json();
            console.log('Full server response:', data);

            // تغيير شرط النجاح
            if (data.status === true) {  // أو data.success === true
                console.log('Login successful');
                
                if (!data.data || !data.data.token) {
                    console.error('No token in response');
                    alert('Server error: No authentication token received');
                    return;
                }

                // تخزين الـ token
                localStorage.setItem('auth_token', data.data.token);
                
                // تخزين بيانات المستخدم
                const userData = {
                    username: data.data.user.username,
                    email: data.data.user.email,
                    user_type: data.data.user.user_type
                };
                
                // حفظ بيانات المستخدم في localStorage
                localStorage.setItem('user_data', JSON.stringify(userData));
                console.log('Stored user data:', userData); // للتأكد من البيانات

                // التوجيه حسب نوع المستخدم
                const redirectPath = data.data.user.user_type === 'student' 
                    ? '/pna/frontend/Student/user_profile/home2.html'
                    : '/pna/frontend/Instractor/dashboard/dashboard.html';

                window.location.href = redirectPath;

            } else {
                console.log('Login failed:', data.message);
                alert(data.message || 'Login failed!');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Error during login: ' + error.message);
        }
    });

    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.querySelector('input[name="remember"]').checked = true;
    }
});
