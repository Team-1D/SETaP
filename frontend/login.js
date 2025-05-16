
// /frontend/js/login.js
import { startActivityTimer } from './activitytimer.js';

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // Crucial: stops page refresh
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }), 
        });

        const data = await response.json();

        if (!response.ok) {  
            throw new Error(data.error || "Login failed");
        }

        // Store user data
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', data.email);
        
        // Start the timer
        startActivityTimer(data.userId);
        
        window.location.href = data.redirect;

        // Debug: Confirm before redirect
        console.log("Redirecting to:", data.redirect);
        
        // Force redirect
        window.location.href = data.redirect || '/home.html';

    } catch (err) {
        errorMessage.style.display = "block";
        errorMessage.textContent = err.message;
        console.error("Login error:", err);
    }
});