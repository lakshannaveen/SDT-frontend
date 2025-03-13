document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Full name validation: only letters and spaces, max 30 characters
    const nameRegex = /^[A-Za-z\s]{1,30}$/;
    if (!nameRegex.test(fullname)) {
        errorMessage.textContent = "Full Name must contain only letters and spaces, max 30 characters.";
        return;
    }

    // Email validation using basic pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = "Please enter a valid email address.";
        return;
    }

    // Password validation: at least 8 characters, must include 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorMessage.textContent = "Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
        return;
    }

    // If validation passes, clear error and redirect
    errorMessage.textContent = "";
    window.location.href = "dashboard.html"; // Redirect after successful registration
});

// Progress effect for input fields
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const maxLength = 16;

fullnameInput.addEventListener('input', updateInputFill);
emailInput.addEventListener('input', updateInputFill);
passwordInput.addEventListener('input', updateInputFill);

function updateInputFill() {
    updateProgressBar(fullnameInput, fullnameInput.value.length);
    updateProgressBar(passwordInput, passwordInput.value.length);
}

function updateProgressBar(inputElement, length) {
    const fillPercentage = (length / maxLength) * 100;
    inputElement.style.backgroundSize = `${fillPercentage}% 100%`;
}
