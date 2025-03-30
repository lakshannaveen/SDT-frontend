document.addEventListener('DOMContentLoaded', function () {
    let isAdminsListVisible = false;
    let isUsersListVisible = false;

    const logoutBtn = document.getElementById('logoutBtn');
    const manageAdminsBtn = document.getElementById('manageAdminsBtn');
    const viewUsersBtn = document.getElementById('viewUsersBtn');
    const addDataBtn = document.getElementById('addDataBtn'); 
    const adminsListContainer = document.getElementById('adminsListContainer');
    const usersListContainer = document.getElementById('usersListContainer');
    const manageDataBtn = document.getElementById('manageDataBtn');

    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('isAdminLoggedIn');
        window.location.href = 'adminlogin.html';
    });

    manageAdminsBtn.addEventListener('click', async function () {
        isAdminsListVisible = !isAdminsListVisible;
        adminsListContainer.style.display = isAdminsListVisible ? 'block' : 'none';
        if (isAdminsListVisible) {
            await loadAdmins();
        }
    });

    viewUsersBtn.addEventListener('click', async function () {
        isUsersListVisible = !isUsersListVisible;
        usersListContainer.style.display = isUsersListVisible ? 'block' : 'none';
        if (isUsersListVisible) {
            await loadUsers();
        }
    });
    manageDataBtn.addEventListener('click', function() {
        window.location.href = 'managedata.html';
    });

    addDataBtn.addEventListener('click', function () {
        window.location.href = 'data.html'; // Navigate to data.html
    });



    async function loadAdmins() {
        try {
            const response = await fetch('https://localhost:7073/api/admin/all');
            if (!response.ok) {
                throw new Error('Failed to fetch admins');
            }

            const admins = await response.json();
            adminsList.innerHTML = '';

            admins.forEach(admin => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${admin.id}</td>
                    <td>${admin.username}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-admin" data-id="${admin.id}">Delete</button>
                    </td>
                `;
                adminsList.appendChild(row);
            });

            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-admin').forEach(button => {
                button.addEventListener('click', async function () {
                    const adminId = this.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this admin?')) {
                        await deleteAdmin(adminId);
                        await loadAdmins(); // Refresh the list
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching admins:', error);
            adminsList.innerHTML = '<tr><td colspan="3">Failed to load admins</td></tr>';
        }
    }

    async function loadUsers() {
        try {
            const response = await fetch('https://localhost:7073/api/user/all');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const users = await response.json();
            usersList.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}">Delete</button>
                    </td>
                `;
                usersList.appendChild(row);
            });

            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-user').forEach(button => {
                button.addEventListener('click', async function () {
                    const userId = this.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this user?')) {
                        await deleteUser(userId);
                        await loadUsers(); // Refresh the list
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            usersList.innerHTML = '<tr><td colspan="4">Failed to load users</td></tr>';
        }
    }

    async function deleteAdmin(adminId) {
        try {
            const response = await fetch(`https://localhost:7073/api/admin/delete/${adminId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete admin');
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error deleting admin:', error);
            alert('Failed to delete admin');
        }
    }

    async function deleteUser(userId) {
        try {
            const response = await fetch(`https://localhost:7073/api/user/delete/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    }
});