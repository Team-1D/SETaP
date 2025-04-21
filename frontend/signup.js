// Function to validate the signup form
function validateSignupForm() {
    // Get form input values
    const email = document.getElementById("email").value;
    const confirmEmail = document.getElementById("confirmEmail").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check if emails match
    if (email !== confirmEmail) {
        alert("Error: Emails do not match.");
        return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Error: Passwords do not match.");
        return false;
    }

    // Check if password meets complexity requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Error: Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.");
        return false;
    }

    // If all checks pass
    alert("Signup form is valid!");
    return true;
}

// Attach the validation function to the form submission
document.getElementById("signupForm").addEventListener("submit", function (event) {
    if (!validateSignupForm()) {
        event.preventDefault(); // Prevent form submission if validation fails
    }
});