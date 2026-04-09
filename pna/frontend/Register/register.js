document.addEventListener('DOMContentLoaded', function() {
    // Particles Animation
    const createParticles = () => {
        console.log('Creating particles...');
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) {
            console.error('Particles container not found');
            return;
        }
        
        // Clear existing particles
        particlesContainer.innerHTML = '';
        
        const animations = ['float', 'floatReverse', 'float2', 'floatReverse2'];
        
        for (let i = 0; i < 200; i++) {
            const particle = document.createElement('span');
            particle.className = 'particle';
            
            const width = Math.random() * 15 + 10;
            const speed = Math.random() * 20 + 20;
            const delay = Math.random() * 10;
            const anim = animations[Math.floor(Math.random() * animations.length)];
            
            particle.style.width = width + 'px';
            particle.style.height = width + 'px';
            particle.style.left = (Math.random() * 100) + '%';
            particle.style.top = (Math.random() * 100) + '%';
            particle.style.animationName = anim;
            particle.style.animationDuration = speed + 's';
            particle.style.animationDelay = delay + 's';
            particle.style.animationIterationCount = 'infinite';
            particle.style.animationFillMode = 'forwards';
            
            particlesContainer.appendChild(particle);
        }
    };

    // Initialize particles
    createParticles();

    // Form handling
    const registerForm = document.getElementById('registerForm');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Form validation and submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.querySelector('input[name="terms"]').checked;
        const userType = document.querySelector('input[name="user_type"]:checked').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (!terms) {
            alert('Please agree to the Terms & Conditions');
            return;
        }

        try {
            console.log('Sending registration request...');
            const response = await fetch('/pna/backend/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: fullName,
                    email: email,
                    password: password,
                    user_type: userType
                })
            });

            const data = await response.json();
            console.log('Server response:', data);
            
            if (data.success) {
                alert('Registration successful! Please login.');
                window.location.href = '/pna/frontend/Login/login.html';
            } else {
                alert(data.message || 'Registration failed!');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Error during registration: ' + error.message);
        }
    });

    // User type selection
    const userTypeInputs = document.querySelectorAll('input[name="user_type"]');
    userTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            console.log('Selected user type:', this.value);
        });
    });
});