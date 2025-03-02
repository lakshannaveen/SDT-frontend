document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Validation for username (only English letters, max 10 characters)
    const usernameRegex = /^[A-Za-z]{1,10}$/;
    if (!usernameRegex.test(username)) {
        errorMessage.textContent = "Username must contain only English letters (max 10 characters).";
        return;
    }

    // Validation for password (8+ characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorMessage.textContent = "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
        return;
    }

    // If validation passes, redirect
    errorMessage.textContent = ""; // Clear error message
    window.location.href = "dashboard.html";
});
