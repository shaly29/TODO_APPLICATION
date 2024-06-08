document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.querySelector(".todo-input");
    const addButton = document.querySelector(".add-button");
    const todosContainer = document.querySelector(".todos");
    const modal = document.querySelector(".modal-background");
    const closeModalButton = document.getElementById("close-modal");
    const editTodoName = document.getElementById("edit-todo-name");
    const editTodoCompleted = document.getElementById("edit-todo-completed");
    const saveTodoButton = document.getElementById("save-todo");

    let todos = [];
    let editTodoId = null;

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
        todos.forEach(todo => {
            const todoItem = document.createElement("li");
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

    fetchTodos();
});
