// Google Sheets Integration
const scriptURL = 'https://script.google.com/macros/s/AKfycbzkf22MgLE8FdEy_Dc6oVPm2LefqSMUHMfGVY4xiVn3OmQPqXRLCIuAJSQZwmk-4-fVuA/exec';

function saveToGoogleSheets(formData) {
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data saved to Google Sheets:', data);
    })
    .catch(error => {
        console.error('Error saving to Google Sheets:', error);
        // Fallback to localStorage
        saveToLocalStorage(formData);
    });
}

function saveToLocalStorage(formData) {
    let submissions = JSON.parse(localStorage.getItem('learnitRegistrations') || '[]');
    submissions.push(formData);
    localStorage.setItem('learnitRegistrations', JSON.stringify(submissions));
}
