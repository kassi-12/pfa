function submitProduct() {
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    let active;
    const radios = document.getElementsByName('active');
    for (const radio of radios) {
        if (radio.checked) {
            active = radio.value;
            break;
        }
    }

    // Assuming eel.add_product accepts these parameters
    eel.add_product(name,category, price, description, active)((response) => {
        alert(response);
    });
}