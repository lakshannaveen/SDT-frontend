document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameHelp = document.getElementById('usernameHelp');
    const passwordHelp = document.getElementById('passwordHelp');

    /// Retrieve click count from localStorage or initialize it ///
    let clickCount = parseInt(localStorage.getItem('clickCount')) || 0;

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); 

        console.log('Form submitted');
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        /// Username validation ///
        const usernameRegex = /^(?=.*[A-Za-z])[A-Za-z\d]{4,}$/;
        if (!usernameRegex.test(username)) {
            usernameHelp.textContent = 'Username must be at least 4 characters long and include at least one letter.';
            isValid = false;
        } else {
            usernameHelp.textContent = '';
        }

        /// Password validation ///
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            passwordHelp.textContent = 'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, and one number.';
            isValid = false;
        } else {
            passwordHelp.textContent = '';
        }

        /// Track login attempts only for "admin123" ///
        if (username === 'admin123') {
            clickCount++;
            localStorage.setItem('clickCount', clickCount);
            console.log(`Click count: ${clickCount}`);

            if (clickCount >= 5) {
                console.log('Redirecting to adminregister.html');
                localStorage.removeItem('clickCount');
                window.location.href = 'adminregister.html';
                return;
            }
        } else {
            localStorage.removeItem('clickCount'); 
        }

        /// Allow form submission if validation passes ///
        if (isValid) {
            localStorage.setItem('isAdminLoggedIn', 'true');  // Store login status
            window.location.href = 'admin_dashboard.html';  // Redirect to dashboard
        }
    });
});
