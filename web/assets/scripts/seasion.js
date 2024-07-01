async function fetchAndDisplayUsers() {
    try {
        const users = await eel.fetch_users()();
        const usersTable = document.querySelector('table tbody');
        usersTable.innerHTML = '';

        users.forEach(user => {
            const row = usersTable.insertRow();

            // Loop through user fields skipping the first (id) and the last (group_id)
            for (let i = 1; i < user.length - 1; i++) {
                const cell = row.insertCell();
                cell.textContent = user[i];
            }

            const actionsCell = row.insertCell();
            actionsCell.classList.add('actions');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            const userId = user[0];
            editButton.setAttribute('data-user-id', userId);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            actionsCell.appendChild(deleteButton);

            editButton.addEventListener('click', () => {
                const userId = editButton.getAttribute('data-user-id');
                window.location.href = `moduser.html?user_id=${userId}`;
            });

            deleteButton.addEventListener('click', async () => {
                if (confirm("Are you sure you want to delete this user?")) {
                    try {
                        const response = await eel.delete_user(userId)();
                        alert(response);
                        fetchAndDisplayUsers();
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayUsers();
});
