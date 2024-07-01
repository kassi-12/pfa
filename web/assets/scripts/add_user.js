document.addEventListener('DOMContentLoaded', (event) => {
    loadGroups();
});

async function loadGroups() {
    try {
        const groups = await eel.fetch_groups()();
        const roleSelect = document.getElementById('role');
        
        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group[0]; 
            option.text = group[1]; 
            roleSelect.add(option);
        });
    } catch (error) {
        console.error('Error fetching groups:', error);
    }
}

function submitUser() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const phone = document.getElementById('phone').value;
    const bio = document.getElementById('bio').value;
    const group_id = document.getElementById('role').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    eel.add_user(username, email, password, firstName, lastName, gender, phone, bio, group_id)((response) => {
        alert(response);
    });
}
