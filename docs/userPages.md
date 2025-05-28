# User Pages

## Account Page
### Frontend
- `accountPage.html`
- `accountPage.js`

### Description
Allows users to see their points, streak and ranking all in one place along side their user name and email they used to log in.

### Logic
- Sends `get` request via JavaScript to backend (**index.js**).
- Requested data is returned.
- Data is displayed to the user.

## Setting Page
### Frontend
- `settings.html`

### Description
Allow users to logout of the application.

### Logic
- Get the `login.html` screen.
- Remove all **localStorage** data.

## Justification
We made an account page so the user can see their own details and their current points and streak if they want to compare it with their friends. The logout is on a different page to prevent misclicking.