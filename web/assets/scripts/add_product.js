function submitProduct() {
    const name = document.getElementById('product-name').value;
    const categoryId = document.getElementById('category-id').value;
    const price = document.getElementById('price').value;
    const status = document.getElementById('status').value;
    const action = document.getElementById('action').value;
    const image = document.getElementById('product-image').files[0]; // Corrected ID

    eel.add_product(name, categoryId, price, status, action) 
        .then(response => {
            alert(response);
        })
        .catch(error => {
            console.error(error);
        });
}




