let addButton = document.getElementById('addTodo');
addButton.addEventListener('click', addTodo);



let todos = [];

function addTodo() {
    const name = document.getElementById('todoName').value;
    const category = document.getElementById('todoCategory').value;
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

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${todo.name} (${todo.category}) - Due: ${todo.due_date} [${todo.status}]
            <button id="delete" onclick="removeTodo(${todo.id})">Delete</button>
            <button id="inProgress" onclick="inProgress(${todo.id})">Edit Status</button>
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

// Load todos on page load
loadTodos();