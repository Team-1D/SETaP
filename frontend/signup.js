


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

document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const confirmEmail = document.getElementById("confirm_email").value;
    const nickname = document.getElementById("username").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;
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
        
        // After successful signup:
        localStorage.setItem('userId', data.userId);
        import('./activitytimer.js')
            .then(module => module.startActivityTimer(data.userId))
            .catch(err => console.error("Timer error:", err));
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