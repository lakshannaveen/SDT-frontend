document.addEventListener('DOMContentLoaded', function () {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');

    if (!isAdminLoggedIn) {
        window.location.href = 'adminlogin.html';  // Redirect to login if not logged in
    }

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('isAdminLoggedIn');  // Remove login status
        window.location.href = 'adminlogin.html';  // Redirect to login page
    });
});
