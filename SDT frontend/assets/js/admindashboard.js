document.addEventListener('DOMContentLoaded', function () {
    let isAdminsListVisible = false;
    let isUsersListVisible = false;
    let isContactsListVisible = false;

    const logoutBtn = document.getElementById('logoutBtn');
    const manageAdminsBtn = document.getElementById('manageAdminsBtn');
    const viewUsersBtn = document.getElementById('viewUsersBtn');
    const addDataBtn = document.getElementById('addDataBtn');
    const manageDataBtn = document.getElementById('manageDataBtn');
    const viewContactsBtn = document.getElementById('viewContactsBtn');
    const adminsListContainer = document.getElementById('adminsListContainer');
    const usersListContainer = document.getElementById('usersListContainer');
    const contactsListContainer = document.getElementById('contactsListContainer');

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

    viewContactsBtn.addEventListener('click', async function () {
        isContactsListVisible = !isContactsListVisible;
        contactsListContainer.style.display = isContactsListVisible ? 'block' : 'none';
        if (isContactsListVisible) {
            await loadContacts();
        }
    });

    manageDataBtn.addEventListener('click', function() {
        window.location.href = 'managedata.html';
    });

    addDataBtn.addEventListener('click', function () {
        window.location.href = 'data.html';
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

            document.querySelectorAll('.delete-admin').forEach(button => {
                button.addEventListener('click', async function () {
                    const adminId = this.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this admin?')) {
                        await deleteAdmin(adminId);
                        await loadAdmins();
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
                    <td><a href="mailto:${user.email}" class="email-link">${user.email}</a></td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}">Delete</button>
                    </td>
                `;
                usersList.appendChild(row);
            });

            document.querySelectorAll('.delete-user').forEach(button => {
                button.addEventListener('click', async function () {
                    const userId = this.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this user?')) {
                        await deleteUser(userId);
                        await loadUsers();
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            usersList.innerHTML = '<tr><td colspan="4">Failed to load users</td></tr>';
        }
    }

    async function loadContacts() {
        try {
            const response = await fetch('https://localhost:7073/api/contact/all');
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }

            const contacts = await response.json();
            contactsList.innerHTML = '';

            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td><a href="tel:${contact.phone}" class="phone-link">${contact.phone}</a></td>
                    <td><a href="mailto:${contact.email}" class="email-link">${contact.email}</a></td>
                    <td>${contact.message}</td>
                    <td>${new Date(contact.submittedAt).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-contact" data-id="${contact.id}">Delete</button>
                    </td>
                `;
                contactsList.appendChild(row);
            });

            document.querySelectorAll('.delete-contact').forEach(button => {
                button.addEventListener('click', async function () {
                    const contactId = this.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this inquiry?')) {
                        await deleteContact(contactId);
                        await loadContacts();
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching contacts:', error);
            contactsList.innerHTML = '<tr><td colspan="7">Failed to load inquiries</td></tr>';
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

    async function deleteContact(contactId) {
        try {
            const response = await fetch(`https://localhost:7073/api/contact/delete/${contactId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete contact');
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Failed to delete contact');
        }
    }
});