let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
  navbar.classList.toggle('active');
}

window.onscroll = () =>{
  navbar.classList.remove('active');
}

document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.querySelector(".todo-input");
    const addButton = document.querySelector(".add-button");
    const todosContainer = document.querySelector(".todos");
    const modal = document.querySelector(".modal-background");
    const closeModalButton = document.getElementById("close-modal");
    const editTodoName = document.getElementById("edit-todo-name");
    const editTodoCompleted = document.getElementById("edit-todo-completed");
    const saveTodoButton = document.getElementById("save-todo");
    const filterButtons = document.querySelectorAll(".filter");

    let todos = [];
    let editTodoId = null;
    let filterStatus = 'all';

    const fetchTodos = async () => {
        const response = await fetch("http://localhost:4007/api/todos");
        todos = await response.json();
        renderTodos();
    };

    const addTodo = async (todo) => {
        await fetch("http://localhost:4007/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        });
        fetchTodos();
    };

    const updateTodo = async (id, todo) => {
        await fetch(`http://localhost:4007/api/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        });
        fetchTodos();
    };

    const deleteTodo = async (id) => {
        await fetch(`http://localhost:4007/api/todos/${id}`, {
            method: "DELETE"
        });
        fetchTodos();
    };

    const renderTodos = () => {
        todosContainer.innerHTML = "";
        const filteredTodos = todos.filter(todo => {
            if (filterStatus === 'completed') return todo.completed;
            if (filterStatus === 'pending') return !todo.completed;
            return true;
        });

        filteredTodos.forEach(todo => {
            const todoItem = document.createElement("li");
            todoItem.classList.add("todo-item");
            todoItem.textContent = todo.item;

            const actionsContainer = document.createElement("div");
            actionsContainer.classList.add("actions");

            const editIcon = document.createElement("i");
            editIcon.classList.add("fa", "fa-pencil", "edit");
            editIcon.addEventListener("click", (event) => {
                event.stopPropagation();
                openEditModal(todo);
            });

            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa", "fa-trash", "delete");
            deleteIcon.addEventListener("click", (event) => {
                event.stopPropagation();
                deleteTodo(todo._id);
            });

            actionsContainer.appendChild(editIcon);
            actionsContainer.appendChild(deleteIcon);

            todoItem.appendChild(actionsContainer);
            todosContainer.appendChild(todoItem);
        });
    };

    const openEditModal = (todo) => {
        editTodoId = todo._id;
        editTodoName.value = todo.item;
        editTodoCompleted.checked = todo.completed;
        modal.style.display = "flex";
    };

    const closeModal = () => {
        modal.style.display = "none";
    };

    addButton.addEventListener("click", (event) => {
        event.preventDefault();
        const newTodo = { item: todoInput.value, completed: false };
        addTodo(newTodo);
        todoInput.value = "";
    });

    closeModalButton.addEventListener("click", closeModal);

    saveTodoButton.addEventListener("click", (event) => {
        event.preventDefault();
        const updatedTodo = {
            item: editTodoName.value,
            completed: editTodoCompleted.checked
        };
        updateTodo(editTodoId, updatedTodo);
        closeModal();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterStatus = button.dataset.filter;
            renderTodos();
        });
    });

    fetchTodos();
});

// Register
async function register(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:4007/api/v1/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    if (response.ok) {
        const data = await response.json();
        alert('Registration successful');
        console.log(data);
        showLogin(); // Show login form after successful registration
    } else {
        alert('Registration failed');
        console.log('Error:', response.statusText);
    }
}

// Login
async function login(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:4007/api/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (response.ok) {
        const data = await response.json();
        alert('Login successful');
        console.log(data);
        showTodoApp(); // Show todo app after successful login
    } else {
        alert('Login failed');
        console.log('Error:', response.statusText);
    }
}

function showRegister() {
    document.getElementById('register').style.display = 'block';
    document.getElementById('login').style.display = 'none';
    document.getElementById('todo-app').style.display = 'none';
}

function showLogin() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    document.getElementById('todo-app').style.display = 'none';
}

function showTodoApp() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('todo-app').style.display = 'block';
}
