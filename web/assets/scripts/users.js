async function fetchAndDisplayUsers() {
    try {
        const users = await eel.fetch_users()();
        const usersTable = document.querySelector('table tbody');
        usersTable.innerHTML = '';

        users.forEach(user => {
            const row = usersTable.insertRow();
            user.forEach((data, index) => {
                const cell = row.insertCell(index);
                cell.textContent = data;
            });

          
            const actionsCell = row.insertCell(user.length);
            actionsCell.classList.add('actions');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}


window.onload = fetchAndDisplayUsers;
