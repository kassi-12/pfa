document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayProducts();
});

async function fetchAndDisplayProducts() {
    try {
        const products = await eel.fetch_products()(); // Assuming fetch_products is exposed in Eel

        const productsTable = document.getElementById('products-table').getElementsByTagName('tbody')[0];
        productsTable.innerHTML = '';

        products.forEach(product => {
            const row = productsTable.insertRow();

            const productNameCell = row.insertCell(0);
            productNameCell.textContent = product[1]; // Product Name

            const priceCell = row.insertCell(1);
            priceCell.textContent = product[3]; // Price

            const statusCell = row.insertCell(2);
            statusCell.textContent = product[4]; // Status

            const actionsCell = row.insertCell(3);
            actionsCell.classList.add('actions');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.addEventListener('click', () => {
            
                console.log('Edit button clicked for product:', product[0]);
                window.location.href = `modproduct.html?product_id=${product[0]}`;
            });
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.addEventListener('click', async () => {
                if (confirm("Are you sure you want to delete this product?")) {
                    try {
                        const response = await eel.delete_product(product[0])(); // Product ID
                        alert(response); // Show success message
                        fetchAndDisplayProducts(); // Refresh product list
                    } catch (error) {
                        console.error('Error deleting product:', error);
                        alert('Error deleting product. Please try again.');
                    }
                }
            });
            actionsCell.appendChild(deleteButton);
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Error fetching products. Please refresh the page.');
    }
}
