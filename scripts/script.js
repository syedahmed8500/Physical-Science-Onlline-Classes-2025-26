document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error messages
        document.querySelectorAll('.error').forEach(error => {
            error.style.display = 'none';
        });
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const fatherName = document.getElementById('fatherName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        let isValid = true;
        
        // Validate full name
        if (fullName === '') {
            document.getElementById('fullNameError').style.display = 'block';
            isValid = false;
        }
        
        // Validate father's name
        if (fatherName === '') {
            document.getElementById('fatherNameError').style.display = 'block';
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }
        
        // Validate phone
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanedPhone) || cleanedPhone.length < 10) {
            document.getElementById('phoneError').style.display = 'block';
            isValid = false;
        }
        
        // If form is valid, show success message
        if (isValid) {
            successMessage.style.display = 'block';
            
            // In a real application, you would send the data to a server here
            const formData = {
                fullName,
                fatherName,
                email,
                phone,
                additionalInfo: document.getElementById('additionalInfo').value.trim(),
                timestamp: new Date().toISOString()
            };
            
            console.log('Form submitted with data:', formData);
            
            // Store in localStorage (as a simple alternative to a database)
            let submissions = JSON.parse(localStorage.getItem('registrationSubmissions') || '[]');
            submissions.push(formData);
            localStorage.setItem('registrationSubmissions', JSON.stringify(submissions));
            
            // Reset form
            form.reset();
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Hide success message after 8 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 8000);
        }
    });
    
    // Add input event listeners to clear errors when user starts typing
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    });
});
