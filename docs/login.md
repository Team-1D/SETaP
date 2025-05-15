# Login

## Frontend
- `login.html`
- `login.js`

## Backend
- `loginController.js`

## Description
Allows users to sign into their account securely.

### Logic
- Sends login request via JavaScript to backend
- Controller validates credentials with the database
- Session or error response is returned

### Justification
The login feature is set up to provide secure and user-friendly user authentication, as well as maintain responsiveness and error handling. The login form provides users with clear input fields, as well as a toggle to gather user passwords. When the user submits the login form, the client-side Javascript (login.js) prevents the page from fully reloading and handles authentication asynchronously using the fetch API, providing a smoother user experience.

User credentials are sent to the backend, where the loginController.js handles validation. This controller handles user credential validation by looking by email in the PostgreSQL database, and passwords are verified using bcrypt.compare() to securely match the hashed values. The error handling is made to be clear and specific so that users get immediate feedback without exposing any internal logic or credentials.

When the user login is successful, the relevant session data (like the userId and email) are stored in localStorage, and an activity timer is started for tracking user engagement. From there, the user is redirected to the dashboard (home.html), completing the login flow. 

The frontend handling, validation, and database access in the backend are all separate to ensure maintainability and security.