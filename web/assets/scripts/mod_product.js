// Function to fetch product details and populate form
async function fetchProduct(productId) {
    try {
        const product = await eel.fetch_product_by_id(productId)(); 
        console.log("Product fetched is :", product)
        // Populate form fields with product details
        document.getElementById('product-name').value = product[1];
        document.getElementById('price').value = product[3];
        document.getElementById('description').value = product[4];

        // Set selected category in dropdown
        const categoryDropdown = document.getElementById('category');
        const selectedCategory = product[2]; 
        for (let i = 0; i < categoryDropdown.options.length; i++) {
            if (categoryDropdown.options[i].value === selectedCategory.toString()) {
                categoryDropdown.selectedIndex = i;
                break;
            }
        }

        // Set status radio button
        const status = product[5]; 
        if (status === 'active') {
            document.getElementById('active-yes').checked = true;
        } else {
            document.getElementById('active-no').checked = true;
        }

    } catch (error) {
        console.error('Error fetching product:', error);
        alert('Error fetching product details. Please try again.');
    }
}

// Function to update product
async function updateProduct() {
    const productId = getUserIdFromURL(); // Assuming function returns productId from URL params
    const productName = document.getElementById('product-name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const status = document.querySelector('input[name="status"]:checked').value;

    try {
        const success = await eel.update_product(
            productId,
            productName,
            category,
            price,
            status,
            description
        )();

        if (success) {
            alert('Product updated successfully!');
            // Optionally redirect to another page or perform additional actions
        } else {
            alert('Failed to update product.');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        alert('An error occurred while updating the product.');
    }
}

// Function to load categories into dropdown
async function loadCategories() {
    try {
        const categories = await eel.fetch_categorys()(); 
        const categoryDropdown = document.getElementById('category');

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category[0]; // Assuming category_id is at index 0 in category array
            option.textContent = category[1]; // Assuming category_name is at index 1 in category array
            categoryDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Error fetching categories. Please try again.');
    }
}

// Function to get productId from URL params
function getUserIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product_id');
    console.log("Product ID from URL:", productId);
    return productId;
}

// Load product details and categories on page load
document.addEventListener('DOMContentLoaded', () => {
    const productId = getUserIdFromURL(); // Assuming function returns productId from URL params
    if (productId) {
        fetchProduct(productId);
    }
    loadCategories();
});
