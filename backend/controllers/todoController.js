const Todo=require("../models/todoItems")



// Get all todos
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new todo
exports.createTodo = async (req, res) => {
    const { item } = req.body;

    if (!item) {
        return res.status(400).json({ error: 'Item is required' });
    }

    try {
        const newTodo = new Todo({ item });
        const todo = await newTodo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a todo
exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { item } = req.body;

    if (!item) {
        return res.status(400).json({ error: 'Item is required' });
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(id, { item }, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

