
async function fetchAndDisplayGroups() {
    try {
        const groups = await eel.fetch_groups()();
        const groupTable = document.querySelector('#group-data');
        groupTable.innerHTML = '';

        groups.forEach(group => {
            const row = groupTable.insertRow();
            const nameCell = row.insertCell();
            nameCell.textContent = group[1];

            const actionsCell = row.insertCell();
            actionsCell.classList.add('actions');

            
            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.onclick = () => editGroup(group[0], group[1]);
            actionsCell.appendChild(editButton);

            
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.onclick = () => deleteGroup(group[0]);
            actionsCell.appendChild(deleteButton);

            
            const viewUsersButton = document.createElement('button');
            viewUsersButton.classList.add('view-users-btn');
            viewUsersButton.innerHTML = '<i class="fas fa-users"></i>';
            viewUsersButton.onclick = () => viewGroupUsers(group[0]);
            actionsCell.appendChild(viewUsersButton);
        });
    } catch (error) {
        console.error('Error fetching groups:', error);
    }
}


async function submitGroup() {
    const groupName = document.getElementById('group-name').value;

    try {
        const response = await eel.add_group(groupName)();
        alert(response);
        fetchAndDisplayGroups(); 
        resetGroupForm();
    } catch (error) {
        console.error('Error adding group:', error);
    }
}


function editGroup(id, name) {
    document.getElementById('group-name').value = name;

    const submitBtn = document.getElementById('submit-group-btn');
    submitBtn.textContent = 'UPDATE';
    submitBtn.onclick = () => updateGroup(id);
}


async function updateGroup(id) {
    const groupName = document.getElementById('group-name').value;

    try {
        const response = await eel.update_group(id, groupName)();
        alert(response);
        fetchAndDisplayGroups(); 
        resetGroupForm();
    } catch (error) {
        console.error('Error updating group:', error);
    }
}

async function deleteGroup(id) {
    if (confirm("Are you sure you want to delete this group?")) {
        try {
            const response = await eel.delete_group(id)();
            alert(response);
            fetchAndDisplayGroups(); 
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    }
}


function resetGroupForm() {
    document.getElementById('group-name').value = '';

    const submitBtn = document.getElementById('submit-group-btn');
    submitBtn.textContent = 'ADD';
    submitBtn.onclick = submitGroup;
}


function viewGroupUsers(groupId) {
    window.location.href = `emp_group.html?group_id=${groupId}`;
}


document.addEventListener('DOMContentLoaded', () => {
   
    const viewUsersButton = document.getElementById('view-users-button');
    if (viewUsersButton) {
        viewUsersButton.onclick = () => {
            const groupId = document.getElementById('group-id').value;
            viewGroupUsers(groupId);
        };
    }

    
    fetchAndDisplayGroups();
});

