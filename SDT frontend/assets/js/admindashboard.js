document.addEventListener('DOMContentLoaded', function () {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');

    if (!isAdminLoggedIn) {
        window.location.href = 'adminlogin.html'; // Redirect to login if not logged in
    }

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('isAdminLoggedIn'); // Remove login status
        window.location.href = 'adminlogin.html'; // Redirect to login page
    });

    const manageAdminsBtn = document.getElementById('manageAdminsBtn');
    const adminsListContainer = document.getElementById('adminsListContainer');
    const adminsList = document.getElementById('adminsList');

    let isAdminsListVisible = false; // Track visibility state

    manageAdminsBtn.addEventListener('click', async function () {
        isAdminsListVisible = !isAdminsListVisible; // Toggle visibility state
        adminsListContainer.style.display = isAdminsListVisible ? 'block' : 'none';

        if (isAdminsListVisible) {
            try {
                const response = await fetch('https://localhost:7073/api/admin/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch admins');
                }

                const admins = await response.json();
                adminsList.innerHTML = ''; // Clear the table

                admins.forEach(admin => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${admin.id}</td>
                        <td>${admin.username}</td> <!-- Map username to Name column -->
                    `;
                    adminsList.appendChild(row);
                });
            } catch (error) {
                console.error('Error fetching admins:', error);
                adminsList.innerHTML = '<tr><td colspan="2">Failed to load admins</td></tr>';
            }
        }
    });
});