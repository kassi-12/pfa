async function fetchAndDisplayTables() {
    try {
        const tables = await eel.fetch_tables()();
        const tablesTable = document.querySelector('table tbody');
        tablesTable.innerHTML = '';

        tables.forEach(table => {
            const row = tablesTable.insertRow();
            // Skip the first element (ID column)
            for (let i = 1; i < table.length; i++) {
                const cell = row.insertCell();
                cell.textContent = table[i];
            }

            const actionsCell = row.insertCell();
            actionsCell.classList.add('actions');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.onclick = () => editTable(table[0], table[1], table[2], table[3], table[4]);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.onclick = () => deleteTable(table[0]);
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
        resetForm();
    } catch (error) {
        console.error('Error adding table:', error);
    }
}

function editTable(id, name, capacity, availability, status) {
    document.getElementById('table-name').value = name;
    document.getElementById('capacity').value = capacity;
    document.getElementById('availability').value = availability;
    document.getElementById('status').value = status;

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'UPDATE';
    submitBtn.onclick = () => updateTable(id);
}

async function updateTable(id) {
    const tableName = document.getElementById('table-name').value;
    const capacity = document.getElementById('capacity').value;
    const availability = document.getElementById('availability').value;
    const status = document.getElementById('status').value;

    try {
        const response = await eel.update_table(id, tableName, capacity, availability, status)();
        alert(response);
        fetchAndDisplayTables();
        resetForm();
    } catch (error) {
        console.error('Error updating table:', error);
    }
}

async function deleteTable(id) {
    if (confirm("Are you sure you want to delete this table?")) {
        try {
            const response = await eel.delete_table(id)();
            alert(response);
            fetchAndDisplayTables();
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    }
}

function resetForm() {
    document.getElementById('table-name').value = '';
    document.getElementById('capacity').value = '';
    document.getElementById('availability').value = 'available';
    document.getElementById('status').value = 'active';

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'ADD';
    submitBtn.onclick = submitTable;
}

window.onload = fetchAndDisplayTables;
