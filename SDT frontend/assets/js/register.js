document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Name validation: max 10 characters, only English letters (A-Z, a-z)
    const nameRegex = /^[A-Za-z]{1,10}$/;
    if (!nameRegex.test(name)) {
        errorMessage.textContent = "Name must contain only English letters and be a maximum of 10 characters.";
        return;
    }

    // Email validation: must follow email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = "Email must be in a valid format (example@gmail.com).";
        return;
    }

    // Password validation: at least 8 characters, must include 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorMessage.textContent = "Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
        return;
    }

    // If validation passes, clear the error message and redirect
    errorMessage.textContent = "";
    window.location.href = "dashboard.html";
});

// Update background progress based on input length
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const maxLength = 16; // Maximum characters allowed

nameInput.addEventListener('input', updateInputFill);
passwordInput.addEventListener('input', updateInputFill);
emailInput.addEventListener('input', updateEmailFill);

function updateInputFill() {
    updateProgressBar(this, this.value.length);
}

function updateEmailFill() {
    const value = emailInput.value;
    const atIndex = value.indexOf('@');
    
    if (atIndex !== -1) {
        const fillPercentage = ((atIndex + 1) / maxLength) * 100;
        emailInput.style.backgroundSize = `${fillPercentage}% 100%`;
    } else {
        updateProgressBar(emailInput, value.length);
    }
}

function updateProgressBar(inputElement, length) {
    const fillPercentage = (length / maxLength) * 100;
    inputElement.style.backgroundSize = `${fillPercentage}% 100%`;
}
