document.addEventListener('DOMContentLoaded', function () {
    populateTableSelect();
    populateProductSelect();

    document.querySelector('.add-product-btn').addEventListener('click', addProductRow);
    document.getElementById('create-order-btn').addEventListener('click', createOrder);

    async function populateTableSelect() {
        try {
            const tables = await eel.fetch_tables()();
            const tableSelect = document.getElementById('table');
            tableSelect.innerHTML = ''; // Clear existing options

            tables.forEach(table => {
                if (table[3] === 'available' && table[4] === 'active') {
                    const option = document.createElement('option');
                    option.value = table[0];
                    option.text = table[1];
                    tableSelect.appendChild(option);
                }
            });

            console.log("Tables populated successfully!");
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    }

    async function populateProductSelect(container = null) {
        try {
            const products = await eel.fetch_products()();
            const productContainers = container ? [container] : document.querySelectorAll('#product-container .form-group');

            productContainers.forEach(container => {
                const productSelect = container.querySelector('select[name="product[]"]');
                const priceInput = container.querySelector('input[name="price[]"]');
                const quantityInput = container.querySelector('input[name="quantity[]"]');

                if (productSelect) {
                    productSelect.innerHTML = '<option value="">Select a product</option>'; // Clear existing options and add default option

                    products.forEach(product => {
                        // Add condition here to check if product status is 'active'
                        const option = document.createElement('option');
                        option.value = product[0];
                        option.text = product[1];
                        option.dataset.price = product[3]; 
                       
                        productSelect.appendChild(option);
                    });

                    productSelect.addEventListener('change', (event) => {
                        const selectedOption = event.target.selectedOptions[0];
                        const price = parseFloat(selectedOption ? selectedOption.dataset.price : '');
                        priceInput.value = isNaN(price) ? '' : price.toFixed(2);
                        calculateTotals();
                    });

                    priceInput.value = ''; // Clear price input
                    if (quantityInput) {
                        quantityInput.value = '1'; // Set quantity to 1
                    }
                } else {
                    console.error("Product select element not found in container:", container);
                }
            });

            // Calculate totals initially after products are populated
            calculateTotals();

            console.log("Products populated successfully!");
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    function addProductRow() {
        const productContainer = document.getElementById('product-container');
        const newProductRow = document.createElement('div');
        newProductRow.classList.add('form-group');

        const productSelect = document.createElement('select');
        productSelect.name = 'product[]';
        productSelect.classList.add('form-control');

        const priceInput = document.createElement('input');
        priceInput.type = 'text';
        priceInput.name = 'price[]';
        priceInput.classList.add('form-control');
        priceInput.placeholder = 'Price';
        priceInput.readOnly = true;

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.name = 'quantity[]';
        quantityInput.classList.add('form-control');
        quantityInput.placeholder = 'Quantity';
        quantityInput.min = '1';
        quantityInput.value = '1';
        quantityInput.step = '1';

        const removeBtn = document.createElement('span');
        removeBtn.classList.add('material-icons-sharp', 'remove-product-btn');
        removeBtn.textContent = 'remove';
        removeBtn.addEventListener('click', () => {
            productContainer.removeChild(newProductRow);
            calculateTotals();
        });

        productSelect.addEventListener('change', (event) => {
            const selectedOption = event.target.selectedOptions[0];
            const price = parseFloat(selectedOption ? selectedOption.dataset.price : '');
            priceInput.value = isNaN(price) ? '' : price.toFixed(2);
            calculateTotals();
        });
        quantityInput.addEventListener('input', calculateTotals);

        newProductRow.appendChild(productSelect);
        newProductRow.appendChild(priceInput);
        newProductRow.appendChild(quantityInput);
        newProductRow.appendChild(removeBtn);

        productContainer.appendChild(newProductRow);

        // Populate products for the new row only
        populateProductSelect(newProductRow);
    }

    async function calculateTotals() {
        const products = document.getElementsByName('product[]');
        const quantities = document.getElementsByName('quantity[]');

        let grossAmount = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i].selectedOptions[0];
            if (!product) continue;

            const productPrice = parseFloat(product.dataset.price);
            const quantity = parseInt(quantities[i].value);

            const itemTotal = isNaN(productPrice) || isNaN(quantity) ? 0 : productPrice * quantity;
            grossAmount += itemTotal;
        }

        const sCharge = grossAmount * 0.03;
        const vat = grossAmount * 0.13;
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const netAmount = grossAmount + sCharge + vat - discount;

        document.getElementById('gross-amount').value = isNaN(grossAmount) ? '0.00' : grossAmount.toFixed(2);
        document.getElementById('s-charge').value = isNaN(sCharge) ? '0.00' : sCharge.toFixed(2);
        document.getElementById('vat').value = isNaN(vat) ? '0.00' : vat.toFixed(2);
        document.getElementById('net-amount').value = isNaN(netAmount) ? '0.00' : netAmount.toFixed(2);
    }

    async function createOrder() {
        const table = document.getElementById('table').value;
        const products = document.getElementsByName('product[]');
        const quantities = document.getElementsByName('quantity[]');

        const orderItems = [];
        let grossAmount = 0;
        let allQuantitiesValid = true;

        for (let i = 0; i < products.length; i++) {
            const product = products[i].selectedOptions[0];
            if (!product) continue;

            const productID = product.value;
            const productName = product.text;
            const productPrice = parseFloat(product.dataset.price);
            const quantity = parseInt(quantities[i].value);

            if (isNaN(quantity) || quantity <= 0) {
                allQuantitiesValid = false;
                alert(`Invalid quantity for product: ${productName}`);
                break;
            }

            const itemTotal = isNaN(productPrice) || isNaN(quantity) ? 0 : productPrice * quantity;
            grossAmount += itemTotal;

            orderItems.push({ productID, productName, quantity, itemTotal });
        }

        if (!allQuantitiesValid) return;

        const sCharge = grossAmount * 0.03;
        const vat = grossAmount * 0.13;
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const netAmount = grossAmount + sCharge + vat - discount;

        const orderData = {
            table,
            orderItems,
            grossAmount,
            sCharge,
            vat,
            discount,
            netAmount,
        };

        console.log("Creating order with data:", orderData);

        try {
            const orderId = await eel.add_order(
                table,
                1, // Assuming user_id is fixed or you retrieve it differently
                grossAmount,
                sCharge,
                vat,
                discount,
                netAmount
            )();

            if (orderId) {
                console.log(`Order created with ID: ${orderId}`);
                const response = await eel.add_order_items(orderId, orderItems)();
                console.log(response);

                // Show a success message
                alert('Order added successfully!');
            } else {
                console.error("Failed to create order");
                alert('Failed to add order. Please try again.');
            }
        } catch (error) {
            console.error("Error creating order:", error);
            alert('An error occurred. Please try again later.');
        }
    }

});
