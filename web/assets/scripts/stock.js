document.addEventListener('DOMContentLoaded', fetchAndDisplayStock);

async function fetchAndDisplayStock() {
    try {
        const stockItems = await eel.fetch_stock()();
        const stockTable = document.querySelector('#category-data');
        stockTable.innerHTML = '';

        stockItems.forEach(item => {
            const row = stockTable.insertRow();
            for (let i = 1; i < item.length; i++) {
                const cell = row.insertCell();
                cell.textContent = item[i];
            }

            const actionsCell = row.insertCell();
            actionsCell.classList.add('actions');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.onclick = () => editStockItem(item[0], item[1], item[2], item[3], item[4]);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.onclick = () => deleteStockItem(item[0]);
            actionsCell.appendChild(deleteButton);

            
        });
    } catch (error) {
        console.error('Error fetching and displaying stock:', error);
    }
}

async function submitStock() {
    const itemName = document.getElementById('item-name').value;
    const quantity = document.getElementById('item-quantity').value;
    const unit = document.getElementById('item-unit').value;
    const price = document.getElementById('item-price').value;

    try {
        const response = await eel.add_stock_item(itemName, quantity, unit, price)();
        if (response) {
            alert('Stock item added successfully!');
            fetchAndDisplayStock();
            resetStockForm();
        } else {
            alert('Failed to add stock item.');
        }
    } catch (error) {
        console.error('Error adding stock item:', error);
    }
}

function editStockItem(id, name, quantity, unit, price) {
    document.getElementById('item-name').value = name;
    document.getElementById('item-quantity').value = quantity;
    document.getElementById('item-unit').value = unit;
    document.getElementById('item-price').value = price;

    const submitBtn = document.getElementById('submit-category-btn');
    submitBtn.textContent = 'UPDATE';
    submitBtn.onclick = () => updateStockItem(id);
}

async function updateStockItem(id) {
    const itemName = document.getElementById('item-name').value;
    const quantity = document.getElementById('item-quantity').value;
    const unit = document.getElementById('item-unit').value;
    const price = document.getElementById('item-price').value;

    try {
        const response = await eel.update_stock_item(id, itemName, quantity, unit, price)();
        if (response) {
            alert('Stock item updated successfully!');
            fetchAndDisplayStock();
            resetStockForm();
        } else {
            alert('Failed to update stock item.');
        }
    } catch (error) {
        console.error('Error updating stock item:', error);
    }
}

async function deleteStockItem(id) {
    if (confirm('Are you sure you want to delete this stock item?')) {
        try {
            const response = await eel.delete_stock_item(id)();
            if (response) {
                alert('Stock item deleted successfully!');
                fetchAndDisplayStock();
            } else {
                alert('Failed to delete stock item.');
            }
        } catch (error) {
            console.error('Error deleting stock item:', error);
        }
    }
}

function resetStockForm() {
    document.getElementById('item-name').value = '';
    document.getElementById('item-quantity').value = '';
    document.getElementById('item-unit').value = '';
    document.getElementById('item-price').value = '';

    const submitBtn = document.getElementById('submit-category-btn');
    submitBtn.textContent = 'ADD';
    submitBtn.onclick = submitStock;
}

async function adjustStockQuantity(id, currentQuantity, adjustment) {
    const newQuantity = parseInt(currentQuantity) + adjustment;
    const itemName = '';  // fetch the item name
    const unit = '';  // fetch the item unit
    const price = '';  // fetch the item price

    try {
        const response = await eel.update_stock_item(id, itemName, newQuantity, unit, price)();
        if (response) {
            alert('Stock quantity adjusted successfully!');
            fetchAndDisplayStock();
        } else {
            alert('Failed to adjust stock quantity.');
        }
    } catch (error) {
        console.error('Error adjusting stock quantity:', error);
    }
}
