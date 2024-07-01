// Function to fetch and display orders
async function fetchAndDisplayOrders() {
    try {
        const orders = await eel.fetch_orders()();
        const ordersTable = document.querySelector('#order-data');
        ordersTable.innerHTML = '';

        orders.forEach(order => {
            const row = ordersTable.insertRow();

            const idCell = row.insertCell();
            idCell.textContent = order[0]; // Order ID

            const paymentCell = row.insertCell();
            paymentCell.textContent = order[8]; // Method

            const statusCell = row.insertCell();
            statusCell.textContent = order[9]; // Status

            const actionsCell = row.insertCell();
            actionsCell.classList.add('actions');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.onclick = () => editOrder(order[0], order[8], order[9],order[10]);
            actionsCell.appendChild(editButton);

            const downloadButton = document.createElement('button');
            downloadButton.classList.add('download-btn');
            downloadButton.innerHTML = '<i class="fas fa-download"></i>';
            downloadButton.onclick = () => downloadOrder(order[0]);
            actionsCell.appendChild(downloadButton);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Function to download an order
async function downloadOrder(id) {
    try {
        const filePath = await eel.download_order(id)();
        if (filePath) {
            const link = document.createElement('a');
            link.href = 'file://' + filePath;
            link.download = filePath.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Failed to download order.');
        }
    } catch (error) {
        console.error('Error downloading order:', error);
    }
}

// Function to submit an order
async function submitOrder() {
    const orderId = document.getElementById('order-number').value;
    const payment = document.getElementById('payment').value;
    const status = document.getElementById('status').value;

    try {
        const response = await eel.add_order(orderId, payment, status)();
        alert(response);
        fetchAndDisplayOrders();
        resetOrderForm();
    } catch (error) {
        console.error('Error adding order:', error);
    }
}

function editOrder(id, payment, status, netAmount) {
    document.getElementById('order-number').value = id;
    document.getElementById('payment').value = payment;
    document.getElementById('status').value = status;
    document.getElementById('net-amount').value = netAmount;

    const submitBtn = document.getElementById('submit-order-btn');
    submitBtn.textContent = 'UPDATE';
    submitBtn.onclick = () => updateOrder(id);
}

// Function to submit an order
async function submitOrder() {
    const orderId = document.getElementById('order-number').value;
    const payment = document.getElementById('payment').value;
    const status = document.getElementById('status').value;

    try {
        const response = await eel.add_order(orderId, payment, status)();
        alert(response);
        fetchAndDisplayOrders(); // Refresh orders after submission
        resetOrderForm();
    } catch (error) {
        console.error('Error adding order:', error);
    }
}

// Function to update an order
async function updateOrder(id) {
    const payment = document.getElementById('payment').value;
    const status = document.getElementById('status').value;

    try {
        const response = await eel.update_order(id, payment, status)();
        alert(response);
        fetchAndDisplayOrders(); // Refresh orders after update
        resetOrderForm();
    } catch (error) {
        console.error('Error updating order:', error);
    }
}

// Function to reset the order form
function resetOrderForm() {
    document.getElementById('order-number').value = '';
    document.getElementById('payment').value = '';
    document.getElementById('status').value = '';
    document.getElementById('net-amount').value = '';

    const submitBtn = document.getElementById('submit-order-btn');
    submitBtn.textContent = 'Done';
    submitBtn.onclick = submitOrder;
}

// Fetch and display orders on page load
window.onload = fetchAndDisplayOrders;
