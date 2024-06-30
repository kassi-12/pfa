async function fetchAndDisplayCategories() {
    try {
        const categories = await eel.fetch_categorys()();
        const categoriesTable = document.querySelector('#category-data');
        categoriesTable.innerHTML = '';

        categories.forEach(category => {
            const row = categoriesTable.insertRow();
            for (let i = 1; i < category.length; i++) {
                const cell = row.insertCell();
                cell.textContent = category[i];
            }

            const actionsCell = row.insertCell();
            actionsCell.classList.add('actions');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.onclick = () => editCategory(category[0], category[1], category[2]);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.onclick = () => deleteCategory(category[0]);
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function submitCategory() {
    const categoryName = document.getElementById('category-name').value;
    const status = document.getElementById('status').value;

    try {
        const response = await eel.add_category(categoryName, status)();
        alert(response);
        fetchAndDisplayCategories();
        resetCategoryForm();
    } catch (error) {
        console.error('Error adding category:', error);
    }
}

function editCategory(id, name, status) {
    document.getElementById('category-name').value = name;
    document.getElementById('status').value = status;

    const submitBtn = document.getElementById('submit-category-btn');
    submitBtn.textContent = 'UPDATE';
    submitBtn.onclick = () => updateCategory(id);
}

async function updateCategory(id) {
    const categoryName = document.getElementById('category-name').value;
    const status = document.getElementById('status').value;

    try {
        const response = await eel.update_category(id, categoryName, status)();
        alert(response);
        fetchAndDisplayCategories();
        resetCategoryForm();
    } catch (error) {
        console.error('Error updating category:', error);
    }
}

async function deleteCategory(id) {
    if (confirm("Are you sure you want to delete this category?")) {
        try {
            const response = await eel.delete_category(id)();
            alert(response);
            fetchAndDisplayCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }
}

function resetCategoryForm() {
    document.getElementById('category-name').value = '';
    document.getElementById('status').value = 'active';

    const submitBtn = document.getElementById('submit-category-btn');
    submitBtn.textContent = 'ADD';
    submitBtn.onclick = submitCategory;
}

window.onload = fetchAndDisplayCategories;
