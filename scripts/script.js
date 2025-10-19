// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    // Registration Form Handling
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
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
            const course = document.getElementById('course').value;
            
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
            
            // Validate course selection
            if (course === '') {
                document.getElementById('courseError').style.display = 'block';
                isValid = false;
            }
            
            // If form is valid, show success message
            if (isValid) {
                successMessage.style.display = 'block';
                
                // Prepare form data
                const formData = {
                    id: Date.now(), // Unique ID
                    fullName,
                    fatherName,
                    email,
                    phone,
                    course,
                    additionalInfo: document.getElementById('additionalInfo').value.trim(),
                    timestamp: new Date().toLocaleString(),
                    status: 'New'
                };
                
                console.log('Registration Form submitted with data:', formData);
                
                // Store in localStorage
                let submissions = JSON.parse(localStorage.getItem('learnitRegistrations') || '[]');
                submissions.push(formData);
                localStorage.setItem('learnitRegistrations', JSON.stringify(submissions));
                
                // Send email notification (if using EmailJS)
                sendEmailNotification(formData);
                
                // Reset form
                registrationForm.reset();
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Hide success message after 8 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 8000);
            }
        });
        
        // Add input event listeners to clear errors when user starts typing
        const inputs = registrationForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
        });
    }
    
    // Contact Form Handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const contactName = document.getElementById('contactName').value.trim();
            const contactEmail = document.getElementById('contactEmail').value.trim();
            const contactMessage = document.getElementById('contactMessage').value.trim();
            
            // Prepare contact data
            const contactData = {
                id: Date.now(),
                name: contactName,
                email: contactEmail,
                message: contactMessage,
                timestamp: new Date().toLocaleString()
            };
            
            console.log('Contact Form submitted with data:', contactData);
            
            // Store in localStorage
            let contacts = JSON.parse(localStorage.getItem('learnitContacts') || '[]');
            contacts.push(contactData);
            localStorage.setItem('learnitContacts', JSON.stringify(contacts));
            
            // Show alert
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to navigation links based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.main-nav a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.course-card, .flow-step, .stat');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }
    
    // Initial call
    animateOnScroll();
    
    // Call on scroll
    window.addEventListener('scroll', animateOnScroll);
});

// Function to send email notification using EmailJS
function sendEmailNotification(formData) {
    // You need to set up EmailJS (free tier available)
    // Replace with your actual EmailJS service ID, template ID, and user ID
    if (typeof emailjs !== 'undefined') {
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            to_name: 'LearnIT Academy',
            from_name: formData.fullName,
            from_email: formData.email,
            phone: formData.phone,
            course: formData.course,
            father_name: formData.fatherName,
            additional_info: formData.additionalInfo,
            timestamp: formData.timestamp
        }, 'YOUR_USER_ID')
        .then(function(response) {
            console.log('Email sent successfully!', response);
        }, function(error) {
            console.log('Email failed to send:', error);
        });
    }
}

// Admin function to view all registrations
function viewRegistrations() {
    const submissions = JSON.parse(localStorage.getItem('learnitRegistrations') || '[]');
    console.table(submissions);
    return submissions;
}

// Admin function to export data as CSV
function exportToCSV() {
    const submissions = JSON.parse(localStorage.getItem('learnitRegistrations') || '[]');
    if (submissions.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Create CSV header
    let csv = 'ID,Full Name,Father Name,Email,Phone,Course,Additional Info,Timestamp,Status\n';
    
    // Add data rows
    submissions.forEach(submission => {
        csv += `"${submission.id}","${submission.fullName}","${submission.fatherName}","${submission.email}","${submission.phone}","${submission.course}","${submission.additionalInfo}","${submission.timestamp}","${submission.status}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `learnit_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Admin function to clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear all registration data? This cannot be undone.')) {
        localStorage.removeItem('learnitRegistrations');
        localStorage.removeItem('learnitContacts');
        alert('All data has been cleared.');
    }
}
