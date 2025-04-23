// Toggle password visibility for both password fields
document.querySelectorAll("#togglePassword").forEach(icon => {
    icon.addEventListener("click", function() {
        const passwordField = this.previousElementSibling;
        const type = passwordField.type === "password" ? "text" : "password";
        passwordField.type = type;
        
        this.classList.toggle("bx-show");
        this.classList.toggle("bx-hide");
    });
});

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const confirmEmail = document.getElementById("confirm_email").value;
    const nickname = document.getElementById("username").value;
    const password = document.querySelector(".create_password_container input[type='password']:first-of-type").value;
    const confirmPassword = document.querySelector(".create_password_container input[type='password']:last-of-type").value;
    const errorMessage = document.getElementById("errorMessage");

    // Reset error message
    errorMessage.style.display = "none";

    // Client-side validation
    if (email !== confirmEmail) {
        showError("Emails do not match");
        return;
    }

    if (password !== confirmPassword) {
        showError("Passwords do not match");
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        showError("Password must be: 8+ chars, 1 uppercase, 1 lowercase, 1 number");
        return;
    }

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email, 
                nickname, 
                password 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Signup failed");
        }

        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', data.email);
        localStorage.setItem('nickname', data.nickname);
        
        window.location.href = data.redirect || '/login.html';

    } catch (err) {
        showError(err.message);
        console.error("Signup error:", err);
    }
});

function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.style.display = "block";
    errorMessage.textContent = message;
}