// Toggle password visibility
document.getElementById("togglePassword").addEventListener("click", function() {
    const passwordField = document.getElementById("password");
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;

    // Toggle the icon
    this.classList.toggle("bx-show");
    this.classList.toggle("bx-hide");
});

// Trigger login on Enter press
document.getElementById("password").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("loginButton").click();
    }
});

// Handle login button click
document.getElementById("loginButton").addEventListener("click", function() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("errorMessage");
    
    if (username !== "admin" || password !== "password") { // Example validation
        errorMessage.style.display = "block"; // Keeps error message visible
    } else {
        errorMessage.style.display = "none"; // Hides error message on success
        alert("Login successful");
    }
});