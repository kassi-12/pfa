async function fetchAndDisplayUsers(groupId) {
    try {
        const users = await eel.fetch_users_by_group(groupId)();
        console.log('Fetched users:', users); 

        const userTable = document.querySelector('#user-data tbody');
        if (!userTable) {
            throw new Error('User table tbody not found.');
        }

        userTable.innerHTML = '';

        users.forEach(userArray => {
            const row = userTable.insertRow();
            row.insertCell().textContent = userArray[1]; 
            row.insertCell().textContent = userArray[2]; 
            row.insertCell().textContent = userArray[3]; 
            row.insertCell().textContent = userArray[4]; 
            row.insertCell().textContent = userArray[5];
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function viewGroupEmployees(groupId) {
    window.location.href = `emp_group.html?group_id=${groupId}`;
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('group_id');
    console.log('Group ID:', groupId); 
    
    if (groupId) {
        fetchAndDisplayUsers(groupId);
    }
});
