
const API_URL = '/items'; // Now we don't need the port, it will be handled by Express

const itemForm = document.getElementById('itemForm');
const itemList = document.getElementById('itemList');

// Fetch and display items
async function fetchItems() {
    const response = await fetch(API_URL);
    const items = await response.json();
    itemList.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name}: ${item.description}</span>
            <button class="edit" data-id="${item._id}">Edit</button>
            <button class="delete" data-id="${item._id}">Delete</button>
        `;
        itemList.appendChild(li);
    });
}

// Add new item
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
    });
    itemForm.reset();
    fetchItems();
});

// Edit and Delete functionality
itemList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit')) {
        const id = e.target.getAttribute('data-id');
        const name = prompt('Enter new name:');
        const description = prompt('Enter new description:');
        if (name && description) {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            fetchItems();
        }
    } else if (e.target.classList.contains('delete')) {
        const id = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this item?')) {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchItems();
        }
    }
});

// Initial fetch
fetchItems();
