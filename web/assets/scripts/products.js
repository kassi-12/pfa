async function fetchProducts() {
    try {
        const products = await eel.fetch_products()();
        const productsTable = document.querySelector('table tbody');
        productsTable.innerHTML = '';

        products.forEach(product => {
            const row = productsTable.insertRow();

            // Insert product ID as the first invisible cell
            const idCell = row.insertCell(0);
            idCell.textContent = product[0];
            idCell.style.display = 'none'; // Hide the product ID cell

            // Add other product details
            for (let i = 1; i < product.length; i++) {
                const data = product[i];
                const cell = row.insertCell(i);
                cell.textContent = data;
            }

            const actionsCell = row.insertCell(product.length);
            actionsCell.classList.add('actions');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            actionsCell.appendChild(deleteButton);

            // Add event listener to the edit button
            editButton.addEventListener('click', () => {
                const productId = row.cells[0].textContent;
                window.location.href = `./modifyproduct.html?id=${productId}`;
            });

            // Add event listener to the delete button
            deleteButton.addEventListener('click', async () => {
                const productId = row.cells[0].textContent;

                try {
                    await eel.delete_product(productId)();
                    row.remove();
                } catch (error) {
                    console.error('Error deleting product:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}






async function fetchProducts() {
    try {
        const products = await eel.fetch_products()();
        const productsTable = document.querySelector('table tbody');
        productsTable.innerHTML = '';

        // Map category IDs to category names
        const categoryMap = {
            1: 'Appetizer',
            2: 'Main Course',
            3: 'Dessert',
            4: 'Beverage'
        };

        products.forEach(product => {
            const row = productsTable.insertRow();

            // Insert product ID as the first invisible cell
            const idCell = row.insertCell(0);
            idCell.textContent = product[0];
            idCell.style.display = 'none'; // Hide the product ID cell

            // Add other product details
            const nameCell = row.insertCell(1);
            nameCell.textContent = product[1];

            const categoryCell = row.insertCell(2);
            categoryCell.textContent = categoryMap[product[2]]; // Display category name

            const priceCell = row.insertCell(3);
            priceCell.textContent = product[3];

            const descriptionCell = row.insertCell(4);
            descriptionCell.textContent = product[4];

            const activeCell = row.insertCell(5);
            activeCell.textContent = product[5] ? 'Yes' : 'No'; // Display active status

            const actionsCell = row.insertCell(6);
            actionsCell.classList.add('actions');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            actionsCell.appendChild(deleteButton);

            // Add event listener to the edit button
            editButton.addEventListener('click', () => {
                const productId = row.cells[0].textContent;
                window.location.href = `./modifyproduct.html?id=${productId}`;
            });

            // Add event listener to the delete button
            deleteButton.addEventListener('click', async () => {
                const productId = row.cells[0].textContent;

                try {
                    await eel.delete_product(productId)();
                    row.remove();
                } catch (error) {
                    console.error('Error deleting product:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

window.onload = fetchProducts;


window.onload = fetchProducts;
