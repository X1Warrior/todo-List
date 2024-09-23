let todos = [];
let categories = [
    { id: "1", name: "Personal" },
    { id: "2", name: "Work" },
    { id: "3", name: "School" },
    { id: "4", name: "Other" }
];

function addTodo() {
    const name = document.getElementById('todoName').value;
    const categoryElement = document.getElementById('todoCategory');
    const category = categoryElement.value;
    const dueDate = document.getElementById('todoDueDate').value;

    if (name.trim() === '' || category.trim() === '' || dueDate === '') {
        alert('Please fill out all fields');
        return;
    }

    const newTodo = {
        id: todos.length + 1,
        name: name,
        category: category,
        due_date: dueDate,
        status: "not started"
    };

    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
    clearInputs();
}

function renderFilterButtons() {
    const filtersDiv = document.getElementById('filters');
    filtersDiv.innerHTML = ''; // Clear existing buttons

    // Add the "All" button
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.onclick = () => filterTodos('All');
    filtersDiv.appendChild(allButton);

    // Add buttons for each category
    categories.forEach(cat => {
        const buttonContainer = document.createElement('div'); // Container for category buttons
        const button = document.createElement('button');
        button.textContent = cat.name;
        button.onclick = () => filterTodos(cat.id);
        buttonContainer.appendChild(button);

        // Create Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;';
        deleteButton.style.color = 'red';
        deleteButton.style.backgroundColor = 'transparent';
        deleteButton.style.fontSize = '1.5rem';
        deleteButton.onclick = () => deleteCategory(cat.id); // Pass category ID
        buttonContainer.appendChild(deleteButton);

        filtersDiv.appendChild(buttonContainer);
    });
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    const categoryMap = {};
    categories.forEach(cat => categoryMap[cat.id] = cat.name); // Map category IDs to names

    let notStartedCount = 0;
    let inProgressCount = 0;

    todos.forEach(todo => {
        let statusIcon;

        if (todo.status === 'not started') {
            statusIcon = `<span style="color: red;">&#10060;</span>`;
            notStartedCount++;
        } else if (todo.status === 'in progress') {
            statusIcon = `<span id="yellowBox">&#8213;</span>`;
            inProgressCount++;
        } else {
            statusIcon = `<span style="color: green;">&#10004;</span>`;
        }

        const li = document.createElement('li');
        li.setAttribute('data-category', todo.category);
        li.innerHTML = `
            <span id="todoName_${todo.id}">${todo.name}</span> 
            (<span id="todoCategory_${todo.id}">${categoryMap[todo.category]}</span>) - Due: 
            <span id="todoDueDate_${todo.id}">${todo.due_date}</span> 
            ${statusIcon}
            <button id="delete" onclick="removeTodo(${todo.id})">Delete</button>
            <button id="inProgress" onclick="inProgress(${todo.id})">Edit Status</button>
            <button id="editTodo" onclick="editTodos(${todo.id})">Edit</button>
        `;
        todoList.appendChild(li);
    });

    document.getElementById('notStartedCount').textContent = `Not Started: ${notStartedCount}`;
    document.getElementById('inProgressCount').textContent = `In Progress: ${inProgressCount}`;
}

function removeTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function inProgress(id) {
    const todo = todos.find(todo => todo.id === id);
    todo.status = todo.status === "not started" ? "in progress" : 
                  todo.status === "in progress" ? "complete" : "not started";

    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        renderTodos();
    }
    renderCategoryActions();
}

function clearInputs() {
    document.getElementById('todoName').value = '';
    document.getElementById('todoCategory').value = '1'; // Reset to default
    document.getElementById('todoDueDate').value = '';
}

function deleteCompleted() {
    todos = todos.filter(todo => todo.status !== "complete");
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function editTodos(id) {
    const nameField = document.getElementById(`todoName_${id}`);
    const categoryField = document.getElementById(`todoCategory_${id}`);
    const dueDateField = document.getElementById(`todoDueDate_${id}`);

    // Create the category options dynamically based on the current categories
    const categories = ["1: Personal", "2: Work", "3: School", "4: Other"];
    const categorySelect = document.createElement('select');
    categorySelect.id = `editCategory_${id}`;
    
    // Add dynamically created categories
    categories.forEach(cat => {
        const [value, text] = cat.split(": ");
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        categorySelect.appendChild(option);
    });

    // Add any dynamically added categories from the localStorage if applicable
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    const addedCategories = new Set(storedTodos.map(todo => todo.category));
    addedCategories.forEach(category => {
        if (!categories.some(cat => cat.startsWith(category))) {
            const option = document.createElement('option');
            // option.value = category;
            option.textContent = category; // Replace with actual category name if available
            categorySelect.appendChild(option);
        }
    });

    nameField.innerHTML = `<input type="text" id="editName_${id}" value="${nameField.textContent}">`;
    dueDateField.innerHTML = `<input type="date" id="editDueDate_${id}" value="${dueDateField.textContent}">`;

    categoryField.innerHTML = ''; // Clear the current category field
    categoryField.appendChild(categorySelect); // Append the new category select element

    const editButton = document.querySelector(`button[onclick="editTodos(${id})"]`);
    editButton.textContent = "Save";
    editButton.onclick = () => saveEdit(id);
}

function saveEdit(id) {
    const updatedName = document.getElementById(`editName_${id}`).value;
    const updatedCategory = document.getElementById(`editCategory_${id}`).value;
    const updatedDueDate = document.getElementById(`editDueDate_${id}`).value;

    const todo = todos.find(todo => todo.id === id);

    if (todo) {
        todo.name = updatedName;
        todo.category = updatedCategory;
        todo.due_date = updatedDueDate;

        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }
}


// Filter function
function filterTodos(category) {
    const todoListItems = document.querySelectorAll('#todoList li');
    todoListItems.forEach(item => {
        const todoCategory = item.getAttribute('data-category');
        if (category === 'All' || todoCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Modal functions
function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

function renderCategories() {
    const categorySelect = document.getElementById('todoCategory');
    categorySelect.innerHTML = ''; // Clear existing options

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });
}

function addNewCategory() {
    const newCategory = document.getElementById('newCategory').value;
    const categorySelect = document.getElementById('todoCategory');

    if (newCategory.trim() === '') {
        alert('Please enter a category name');
        return;
    }

    // Create a new option element
    const option = document.createElement('option');
    option.value = newCategory; // You might want to set a unique id instead of the name
    option.textContent = newCategory;

    // Append the new option to the select element
    categorySelect.appendChild(option);

    // Create a new delete button for the new category
    const button = document.createElement('button');
    button.textContent = `Delete All ${newCategory} Todos`;
    button.onclick = () => deleteTodosByCategory(newCategory); // Ensure this matches the category logic

    // Append the button to the category actions section
    document.getElementById('categoryActions').appendChild(button);

    // Close modal after adding the new category
    closeModal();

    // Clear input field
    document.getElementById('newCategory').textContent = '';
}

function deleteCategory(categoryId) {
    // Remove the category from the categories array
    categories = categories.filter(cat => cat.id !== categoryId);

    // Update the category dropdown
    const categorySelect = document.getElementById('todoCategory');
    const optionToRemove = Array.from(categorySelect.options).find(option => option.value === categoryId);
    if (optionToRemove) {
        categorySelect.removeChild(optionToRemove);
    }

    // Re-render filter buttons to reflect the changes
    renderFilterButtons();
}

function deleteTodosByCategory(categoryId) {
    todos = todos.filter(todo => todo.category !== categoryId);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
    alert(`All todos in category ${categoryId} have been deleted.`);
}

function renderCategoryActions() {
    const categoryActions = document.getElementById('categoryActions');
    categoryActions.innerHTML = ''; // Clear existing buttons

    const categories = ["1: Personal", "2: Work", "3: School", "4: Other"];
    categories.forEach(cat => {
        const [value, text] = cat.split(": ");
        const button = document.createElement('button');
        button.textContent = `Delete All ${text} Todos`;
        button.onclick = () => deleteTodosByCategory(value);
        categoryActions.appendChild(button);
    });

    // Add dynamically created category buttons based on localStorage or other sources
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    const addedCategories = new Set(storedTodos.map(todo => todo.category));
    addedCategories.forEach(category => {
        if (!categories.some(cat => cat.startsWith(category))) {
            const button = document.createElement('button');
            button.textContent = `Delete All ${category} Todos`;
            button.onclick = () => deleteTodosByCategory(category);
            categoryActions.appendChild(button);
        }
    });
}

// Render categories initially
renderCategories();
renderFilterButtons();
loadTodos();
