document.addEventListener('DOMContentLoaded', function () {
    // Set default date-time for new todo
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const datetimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('input-date').value = datetimeLocal;

    // Add event listeners to all todo items
    document.querySelectorAll('.todo').forEach(todo => {
        const id = todo.id.split('-')[1];
        const editBtn = todo.querySelector('.edit-btn');
        const saveBtn = todo.querySelector('.save-btn');
        const deleteBtn = todo.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => toggleEdit(id));
        saveBtn.addEventListener('click', () => saveEdit(id));
        deleteBtn.addEventListener('click', (e) => confirmDelete(e, id));
    });
});

function toggleEdit(id) {
    const todo = document.getElementById(`todo-${id}`);
    const inputs = todo.querySelectorAll('input[readonly], textarea[readonly]');
    const editBtn = todo.querySelector('.edit-btn');
    const saveBtn = todo.querySelector('.save-btn');

    const isEditing = inputs[0].readOnly;

    inputs.forEach(input => {
        input.readOnly = !isEditing;
        input.classList.toggle('editing', isEditing);
    });

    if (isEditing) {
        editBtn.textContent = 'Cancel';
        saveBtn.style.display = 'inline-block';
    } else {
        editBtn.textContent = 'Edit';
        saveBtn.style.display = 'none';
        // Reset to original values if cancelling
        inputs.forEach(input => input.value = input.defaultValue);
    }
}

function saveEdit(id) {
    const todo = document.getElementById(`todo-${id}`);
    const nameInput = todo.querySelector('.todo-name');
    const dateInput = todo.querySelector('.todo-date');
    const descriptionInput = todo.querySelector('.todo-description');

    const data = {
        name: nameInput.value,
        date: dateInput.value,
        description: descriptionInput.value
    };

    fetch(`/update/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            // Update defaultValue to new values
            nameInput.defaultValue = nameInput.value;
            dateInput.defaultValue = dateInput.value;
            descriptionInput.defaultValue = descriptionInput.value;
            toggleEdit(id); // Reset edit state
        } else {
            alert('Failed to update todo. Please try again.');
        }
    });
}

function confirmDelete(e, id) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this todo?')) {
        window.location.href = e.target.closest('form').action;
    }
}