document.addEventListener('DOMContentLoaded', (event) => {
    loadCategories();
});

async function loadCategories() {
    try {
        const categories = await eel.fetch_categorys()();
        const categorySelect = document.getElementById('category');
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category[0];
            option.text = category[1];
            categorySelect.add(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function submitProduct() {
    const name = document.getElementById('product-name').value;
    const category_id = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const status = document.querySelector('input[name="status"]:checked').value;
    const description = document.getElementById('description').value;

    eel.add_product(name, category_id, price, status, description)((response) => {
        alert(response);
    });
}
