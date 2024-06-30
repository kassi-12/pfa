document.addEventListener('DOMContentLoaded', (event) => {
    // Get query parameter by name
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Map category IDs to category names
    const categoryMap = {
        1: 'Appetizer',
        2: 'Main Course',
        3: 'Dessert',
        4: 'Beverage'
    };

    // Use this function to get the productId
    const productId = getQueryParameter('id');

    if (productId) {
        // Fetch and populate product details for editing
        fetchProductDetails(productId);
    }

    async function fetchProductDetails(productId) {
        try {
            const product = await eel.fetch_product_details(productId)();
            // Populate the form fields with product details
            document.getElementById('product-name').value = product.name;
            document.getElementById('category').value = product.category_id;
            document.getElementById('price').value = product.price;
            document.getElementById('description').value = product.description;
            document.getElementById('quantity').value = product.quantity;
            document.querySelector(`input[name="active"][value="${product.active ? 'yes' : 'no'}"]`).checked = true;
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    // Function to modify the product
    async function modifyProduct() {
        const name = document.getElementById('product-name').value;
        const category_id = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;
        const quantity = document.getElementById('quantity').value;
        const active = document.querySelector('input[name="active"]:checked').value === 'yes';

        try {
            const response = await eel.modify_product(productId, name, category_id, price, description, active, quantity)();
            // Redirect or show a success message
            window.location.href = './products.html';
        } catch (error) {
            console.error('Error modifying product:', error);
        }
    }

    // Add event listener to the form submit button
    document.querySelector('.submit-btn').addEventListener('click', (event) => {
        event.preventDefault();
        modifyProduct();
    });
});
