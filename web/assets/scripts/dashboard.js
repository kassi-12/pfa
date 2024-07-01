// Function to fetch and display users
async function displayUsers() {
    try {
        let users = await eel.fetch_users()();
        console.log(users); // Check what data is received

        // Clear the current user list
        const userList = document.querySelector('.user-list');
        userList.innerHTML = '';

        for (const user of users) {
            const userDiv = document.createElement('div');
            userDiv.classList.add('user');

            const img = document.createElement('img');
            img.alt = "User profile picture";

            // Fetch group name by group_id
            const groupName = await eel.fetch_group_by_id(user[6])();

            // Set image based on group
            if (groupName === "Admin") {
                img.src = '../../images/administrateur.png';
            } else {
                img.src = '../../images/homme.png';
            }

            const h2 = document.createElement('h2');
            h2.innerText = user[1]; 

            userDiv.appendChild(img);
            userDiv.appendChild(h2);

            userList.appendChild(userDiv);
        }

        // Add the "More" button
        const moreDiv = document.createElement('div');
        moreDiv.classList.add('user');

        const moreLink = document.createElement('a');
        moreLink.href = "../users/adduser.html";

        const moreImg = document.createElement('img');
        moreImg.src = "../../images/plus.png";
        moreImg.alt = "Add more users";

        const moreH2 = document.createElement('h2');
        moreH2.innerText = "More";

        const moreP = document.createElement('p');
        moreP.innerText = "New User";

        moreLink.appendChild(moreImg);
        moreDiv.appendChild(moreLink);
        moreDiv.appendChild(moreH2);
        moreDiv.appendChild(moreP);

        userList.appendChild(moreDiv);
    } catch (error) {
        console.error('Error fetching or displaying users:', error);
    }
}



async function displayOrders() {
    try {
        let orders = await eel.fetch_orders()();
        console.log(orders); // Check what data is received

        // Sort and get the last 3 orders
        orders = orders.slice(-3);

        // Clear the current order list
        const orderTableBody = document.querySelector('.recent-orders tbody');
        orderTableBody.innerHTML = '';

        for (const order of orders) {
            const row = document.createElement('tr');

            const orderNumberCell = document.createElement('td');
            orderNumberCell.innerText = order[0]; // Order ID

            const tableCell = document.createElement('td');
            const tableName = await eel.get_table_name_by_id(order[1])(); // Fetch table name by ID
            tableCell.innerText = tableName || 'Unknown'; // Use 'Unknown' if table name is not found

            const paymentCell = document.createElement('td');
            paymentCell.innerText = order[8]; // Payment type

            const statusCell = document.createElement('td');
            statusCell.innerText = order[9]; // Order status

            const actionCell = document.createElement('td');
            actionCell.innerText = ''; // Add any action buttons or links if necessary

            row.appendChild(orderNumberCell);
            row.appendChild(tableCell);
            row.appendChild(paymentCell);
            row.appendChild(statusCell);
            row.appendChild(actionCell);

            orderTableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching or displaying orders:', error);
    }
}
function updateProgressCircle(elementId, percentage) {
    const circle = document.getElementById(elementId);
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

async function fetchData() {
    const response = await eel.fetch_analysis_data()();
    const data = response;

    document.getElementById("totalEarnings").innerText = `$${data.totalEarnings.toFixed(2)}`;
    document.getElementById("totalPaidOrders").innerText = data.totalPaidOrders.toFixed(0); // Display as integer
    document.getElementById("totalFoodProducts").innerText = data.totalFoodProducts.toFixed(0); // Display as integer
    document.getElementById("totalFoodCategory").innerText = data.totalFoodCategory.toFixed(0); // Display as integer
    document.getElementById("totalUnPaidOrders").innerText = data.totalUnPaidOrders.toFixed(0); // Display as integer
    document.getElementById("totalOrders").innerText = data.totalOrders.toFixed(0); // Display as integer
    
    document.getElementById("earningsPercentage").innerText = `${data.totalEarningsPercentage.toFixed(2)}%`;
    document.getElementById("paidOrdersPercentage").innerText = `${data.totalPaidOrdersPercentage.toFixed(2)}%`;
    document.getElementById("foodProductsPercentage").innerText = `${data.totalFoodProductsPercentage.toFixed(2)}%`;
    document.getElementById("foodCategoryPercentage").innerText = `${data.totalFoodCategoryPercentage.toFixed(2)}%`;
    document.getElementById("unpaidOrdersPercentage").innerText = `${data.totalUnPaidOrdersPercentage.toFixed(2)}%`;
    document.getElementById("totalOrdersPercentage").innerText = `${data.totalOrdersPercentage.toFixed(2)}%`;

    updateProgressCircle("earningsCircle", data.totalEarningsPercentage);
    updateProgressCircle("paidOrdersCircle", data.totalPaidOrdersPercentage);
    updateProgressCircle("foodProductsCircle", data.totalFoodProductsPercentage);
    updateProgressCircle("foodCategoryCircle", data.totalFoodCategoryPercentage);
    updateProgressCircle("unpaidOrdersCircle", data.totalUnPaidOrdersPercentage);
    updateProgressCircle("totalOrdersCircle", data.totalOrdersPercentage);
}


document.addEventListener("DOMContentLoaded", fetchData);
// Call the display functions when the page loads
window.onload = function() {
    displayUsers();
    displayOrders();
};
