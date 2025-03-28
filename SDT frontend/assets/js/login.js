document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Username validation: max 10 characters, only English letters (A-Z, a-z)
    const usernameRegex = /^[A-Za-z]{1,10}$/; // Letters only, 1 to 10 characters
    if (!usernameRegex.test(username)) {
        errorMessage.textContent = "Username must contain only English letters and be a maximum of 10 characters.";
        return;
    }

    // Password validation: at least 8 characters, must include 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorMessage.textContent = "Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
        return;
    }

    // If validation passes, clear the error message
    errorMessage.textContent = "";

    try {
        const payload = { name: username, password }; // Send 'name' and 'password' only
        console.log("Payload being sent:", payload); // Debugging line
        
        const response = await fetch('https://localhost:7073/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        console.log("Response from server:", result); // Debugging line

        if (response.ok) {
            alert('Login successful!');
            window.location.href = "home.html";
        } else {
            errorMessage.textContent = result.message || 'Invalid username or password.';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
        console.error("Error during login:", error); // Debugging line
    }
});
// Update background progress based on input length
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Set max length for both fields
const maxLength = 16; // Maximum characters allowed

usernameInput.addEventListener('input', updateInputFill);
passwordInput.addEventListener('input', updateInputFill);

function updateInputFill() {
    const currentUsernameLength = usernameInput.value.length;
    const currentPasswordLength = passwordInput.value.length;

    // Apply progress bar effect for username
    updateProgressBar(usernameInput, currentUsernameLength);

    // Apply progress bar effect for password
    updateProgressBar(passwordInput, currentPasswordLength);
}

function updateProgressBar(inputElement, length) {
    const fillPercentage = (length / maxLength) * 100;
    inputElement.style.backgroundSize = `${fillPercentage}% 100%`;
}