function updateInstructorName() {
    fetch('/pna/backend/instructor/insructor_dashboard/instructor_dashboard.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            const instructorNameElement = document.getElementById('instructorName');
            if (instructorNameElement) {
                instructorNameElement.textContent = data.data.full_name || data.data.username;
            }
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('API Error:', error);
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const instructorNameElement = document.getElementById('instructorName');
        if (instructorNameElement && userData.username) {
            instructorNameElement.textContent = userData.username;
        }
    });
}

document.addEventListener('DOMContentLoaded', updateInstructorName); 