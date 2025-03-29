
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
    const viewUsersBtn = document.getElementById('viewUsersBtn');
    const adminsListContainer = document.getElementById('adminsListContainer');
    const usersListContainer = document.getElementById('usersListContainer');
    const adminsList = document.getElementById('adminsList');
    const usersList = document.getElementById('usersList');

    let isAdminsListVisible = false; // Track visibility state for admins
    let isUsersListVisible = false; // Track visibility state for users

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
                        <td>${admin.username}</td>
                    `;
                    adminsList.appendChild(row);
                });
            } catch (error) {
                console.error('Error fetching admins:', error);
                adminsList.innerHTML = '<tr><td colspan="2">Failed to load admins</td></tr>';
            }
        }
    });

    viewUsersBtn.addEventListener('click', async function () {
        isUsersListVisible = !isUsersListVisible; // Toggle visibility state
        usersListContainer.style.display = isUsersListVisible ? 'block' : 'none';

        if (isUsersListVisible) {
            try {
                const response = await fetch('https://localhost:7073/api/user/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const users = await response.json();
                usersList.innerHTML = ''; // Clear the table

                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                    `;
                    usersList.appendChild(row);
                });
            } catch (error) {
                console.error('Error fetching users:', error);
                usersList.innerHTML = '<tr><td colspan="3">Failed to load users</td></tr>';
            }
        }
    });
});