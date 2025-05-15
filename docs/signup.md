# Sign Up

## Frontend
- `signup.html`
- `signup.js`

## Backend
- `signupController.js`

## Description
Creates a new user account in the system.

### Logic
- Takes username, email, password from user
- Validates input, checks for duplicates
- Stores user securely in PostgreSQL via backend

### Justification
In the frontend, the user is required to confirm both their email and password to minimise user errors, and the password visibility toggle feature helps with this. Client-side checks create less traffic to the database since the application checks for errors before submission. 

The backend (signupController.js) ensures that all the data goes through stricter validation, where all fields are required, email format is checked, and passwords must meet complexity rules, while also checking the uniqueness of the email and nickname.

New users are added with default values for the gamified elements of the app (points, streaks, etc.) and a corresponding streak record is created. This whole process ensures that a new user is onboarded securely and is actively ready before accessing the app features.