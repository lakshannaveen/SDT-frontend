document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameHelp = document.getElementById('usernameHelp');
    const passwordHelp = document.getElementById('passwordHelp');

    ///Retrieve click count from localStorage or initialize it///
    let clickCount = parseInt(localStorage.getItem('clickCount')) || 0;

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); 

        console.log('Form submitted');
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        ///Username validation exactly 8 characters including numbers///
        if (username.length !== 8 || !/\d/.test(username)) {
            usernameHelp.textContent = 'Must be 8 characters long.';
            isValid = false;
        } else {
            usernameHelp.textContent = '';
        }

        ///Password validation must be exactly 8 characters, with required complexity///
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/;
        if (!passwordRegex.test(password)) {
            passwordHelp.textContent = 'Must be 8 characters long, with at least one uppercase, one lowercase, one number, and one special character.';
            isValid = false;
        } else {
            passwordHelp.textContent = '';
        }

        ///Track login attempts only for "admin123"///
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

        ///Allow form submission if validation passes///
        if (isValid) {
            localStorage.removeItem('clickCount');
            loginForm.submit(); 
        }
    });
});
