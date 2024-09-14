let todos = [];

function addTodo() {
    const name = document.getElementById('todoName').value;
    const category = document.getElementById('todoCategory').value;
    const dueDate = document.getElementById('todoDueDate').value;


    if (name.trim() === '' || category.trim() === '' || dueDate === '') {
        alert('Please fill out all fields');
        return;
    }
    console.log(typeof category);

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

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span id="todoName_${todo.id}">${todo.name}</span> 
            (<span id="todoCategory_${todo.id}">${todo.category}</span>) - Due: 
            <span id="todoDueDate_${todo.id}">${todo.due_date}</span> 
            [${todo.status}]
            <button id="delete" onclick="removeTodo(${todo.id})">Delete</button>
            <button id="inProgress" onclick="inProgress(${todo.id})">Edit Status</button>
            <button id="editTodo" onclick="editTodos(${todo.id})">Edit</button>
        `;
        todoList.appendChild(li);
    });
}


function removeTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}


function inProgress(id) {
    // Find the todo by id
    const todo = todos.find(todo => todo.id === id);

    // Update the status of the todo
    if (todo.status === "not started") {
        todo.status = "in progress";
    } else if (todo.status === "in progress") {
        todo.status = "complete";
    }
    else {
        todo.status = "not started";
    }

    // Save the updated todos to localStorage
    localStorage.setItem('todos', JSON.stringify(todos));

    // Re-render the todos
    renderTodos();
}

function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        renderTodos();
    }
    
}

function clearInputs() {
    document.getElementById('todoName').value = '';
    document.getElementById('todoCategory').value = '';
    document.getElementById('todoDueDate').value = '';
}

function deleteCompleted() {
    // Filter out todos that are not "complete"
    todos = todos.filter(todo => todo.status !== "complete");
    
    // Save the updated todos to localStorage
    localStorage.setItem('todos', JSON.stringify(todos));
    
    // Re-render the todos
    renderTodos();
}

function editTodos(id) {
    // Get the current values
    const nameField = document.getElementById(`todoName_${id}`);
    const categoryField = document.getElementById(`todoCategory_${id}`);
    const dueDateField = document.getElementById(`todoDueDate_${id}`);

    // Replace the text content with input fields for editing
    nameField.innerHTML = `<input type="text" id="editName_${id}" value="${nameField.textContent}">`;
    categoryField.innerHTML = `<input type="text" id="editCategory_${id}" value="${categoryField.textContent}">`;
    dueDateField.innerHTML = `<input type="date" id="editDueDate_${id}" value="${dueDateField.textContent}">`;

    // Change the edit button to a save button
    const editButton = document.querySelector(`button[onclick="editTodos(${id})"]`);
    editButton.textContent = "Save";
    editButton.onclick = () => saveEdit(id);
}


function saveEdit(id) {
    // Get the updated values from the input fields
    const updatedName = document.getElementById(`editName_${id}`).value;
    const updatedCategory = document.getElementById(`editCategory_${id}`).value;
    const updatedDueDate = document.getElementById(`editDueDate_${id}`).value;

    // Find the todo by id
    const todo = todos.find(todo => todo.id === id);

    // Update the todo with the new values
    todo.name = updatedName;
    todo.category = updatedCategory;
    todo.due_date = updatedDueDate;

    // Save the updated todos to localStorage
    localStorage.setItem('todos', JSON.stringify(todos));

    // Re-render the todos list
    renderTodos();
}


// Load todos on page load
loadTodos();

