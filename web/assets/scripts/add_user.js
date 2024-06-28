function submitUser() {

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const phone = document.getElementById('phone').value;
    const bio = document.getElementById('bio').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

   
    eel.add_user(username, email, password, firstName, lastName, gender, phone, bio)((response) => {
        alert(response);
    });
}