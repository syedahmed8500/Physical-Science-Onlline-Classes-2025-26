// Google Sheets Integration
const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

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
