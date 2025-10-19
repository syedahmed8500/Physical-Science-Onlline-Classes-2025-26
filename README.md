# LearnIT Academy Website

A comprehensive website for LearnIT Academy featuring course information, registration form, and contact details.

## Features

- Responsive design that works on all devices
- Interactive registration form with validation
- Course catalog with details
- Registration process flowchart
- Contact form
- Modern UI with smooth animations

## File Structure

## Data Saving Methods

### Current Implementation (Local Storage)
The website currently saves form data to the browser's local storage. To view the data:

1. Open the browser's Developer Tools (F12)
2. Go to Application/Storage tab
3. Find Local Storage and click on your website
4. Look for `learnitRegistrations` and `learnitContacts`

### Access Admin Panel
Press `Ctrl + Shift + A` to open the admin panel where you can:
- View all registrations in a table
- Export data to CSV
- Clear all data

### Advanced Data Saving Options

#### Option 1: Google Sheets Integration
1. Create a Google Apps Script
2. Deploy it as a web app
3. Update the `scriptURL` in `google-sheets.js`

#### Option 2: PHP Backend
1. Upload the PHP files to a web server with PHP support
2. Update the form submission to send data to your PHP endpoint

#### Option 3: Email Notifications
1. Sign up for EmailJS (free tier available)
2. Update the email template and IDs in the script
3. Get instant email notifications for new registrations

### Data Security
- All data is stored locally in the user's browser
- For production use, implement server-side validation and storage
- Regularly export and backup your data
