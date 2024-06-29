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

function ModifyProduct(productId) {
    const productName = document.getElementById('product-name').value;
    const categoryId = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const active = document.querySelector('input[name="active"]:checked').value;

    eel.modify_product(productId, productName, categoryId, price, description, active)
        .then(response => {
            alert(response);
            window.location.href = 'index.html'; // Redirect back to the main page
        })
        .catch(error => {
            console.error('Error modifying product:', error);
        });
}

window.onload = fetchProducts;
