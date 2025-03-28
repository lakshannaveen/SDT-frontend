document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Clear previous validation messages
    document.getElementById('usernameHelp').textContent = '';
    document.getElementById('passwordHelp').textContent = '';
    document.getElementById('confirmPasswordHelp').textContent = '';

    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

    // Validate Username
    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,8}$/;
    if (!usernameRegex.test(username)) {
        document.getElementById('usernameHelp').textContent = 'Username must be 4-8 characters long and include at least one letter and one number.';
        return;
    }

    // Validate Password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        document.getElementById('passwordHelp').textContent = 'Password must be at least 8 characters long, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.';
        return;
    }

    // Validate Confirm Password
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordHelp').textContent = 'Passwords do not match!';
        return;
    }

    // Send data to backend
    try {
        const response = await fetch('https://localhost:7073/api/admin/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            let errorMessage = 'Registration failed. Try again.';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
                console.error('JSON parse error:', jsonError);
                errorMessage = 'An unexpected error occurred.';
            }
            document.getElementById('usernameHelp').textContent = errorMessage;
            return;
        }

        const result = await response.json();
        alert(result.message || 'Registration successful! Redirecting to the Login...');
        window.location.href = 'adminlogin.html';

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('usernameHelp').textContent = 'Server error. Please try again later.';
    }
});