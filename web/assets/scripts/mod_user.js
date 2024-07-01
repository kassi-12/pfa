function getUserIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user_id');
    console.log("User ID from URL:", userId);  
    return userId;
}

async function fetchUser(userId) {
    try {
        const user = await eel.fetch_userbyid(userId)();
        console.log("Fetched user data:", user);  
        if (user) {
            document.getElementById('username').value = user[1];
            document.getElementById('email').value = user[2];
            document.getElementById('first-name').value = user[3];
            document.getElementById('last-name').value = user[4];
            document.querySelector(`input[name="gender"][value="${user[5]}"]`).checked = true;
            document.getElementById('phone').value = user[6];
            document.getElementById('bio').value = user[7];
            document.getElementById('role').value = user[8]; 
        } else {
            console.log("No user data found for the provided ID");
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

async function updateUser() {
    const userId = getUserIdFromURL();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const phone = document.getElementById('phone').value;
    const bio = document.getElementById('bio').value;
    const groupId = document.getElementById('role').value;

    if (password && password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const success = await eel.update_user(
            userId,
            username,
            email,
            password,
            firstName,
            lastName,
            gender,
            phone,
            bio,
            groupId
        )();
        if (success) {
            alert('User updated successfully!');
        } else {
            alert('Failed to update user.');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert('An error occurred while updating the user.');
    }
}

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

document.addEventListener('DOMContentLoaded', () => {
    const userId = getUserIdFromURL();
    if (userId) {
        fetchUser(userId);
    }
    loadGroups();
});
