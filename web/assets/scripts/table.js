async function fetchAndDisplayTables() {
    try {
        const tables = await eel.fetch_tables()();
        const tablesTable = document.querySelector('table tbody');
        tablesTable.innerHTML = '';

        tables.forEach(table => {
            const row = tablesTable.insertRow();
          
            for (let i = 1; i < table.length; i++) {
                const cell = row.insertCell();
                cell.textContent = table[i];
            }

            const actionsCell = row.insertCell();
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
        console.error('Error fetching tables:', error);
    }
}

async function submitTable() {
    const tableName = document.getElementById('table-name').value;
    const capacity = document.getElementById('capacity').value;
    const availability = document.getElementById('availability').value;
    const status = document.getElementById('status').value;

    try {
        const response = await eel.add_table(tableName, capacity, availability, status)();
        alert(response);
        fetchAndDisplayTables(); 
    } catch (error) {
        console.error('Error adding table:', error);
    }
}

window.onload = fetchAndDisplayTables;
