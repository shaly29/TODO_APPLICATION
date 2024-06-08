const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController'); // Adjust the path based on your folder structure


// Get all todos
router.get('/todos',  todoController.getTodos);

// Create a new todo
router.post('/todos', todoController.createTodo);

// Update a todo
router.put('/todos/:id',todoController.updateTodo);

// Delete a todo
router.delete('/todos/:id', todoController.deleteTodo);

module.exports = router;
