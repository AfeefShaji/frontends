import { useState, useEffect } from 'react';
import '../styles/Todo.css';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');
  const [isModalOpen, setIsModalOpen] = false;

  const BACKEND_URL = "https://backends-xvqm.onrender.com"; // Updated backend URL

  // Fetch todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Add new todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      });
      const data = await response.json();
      setTodos([data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/api/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editText.trim() || !editingTodo) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/todos/${editingTodo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editText }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => 
        todo._id === editingTodo._id ? updatedTodo : todo
      ));
      closeEditModal();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="todo-container">
        <h1>
          <i className="fas fa-tasks"></i>
          Task Manager
        </h1>
        
        {/* Add Todo Form */}
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="todo-button">
            <span>Add Task</span>
            <i className="fas fa-plus"></i>
          </button>
        </form>

        {/* Todo List */}
        <div className="todo-list">
          {todos.map((todo) => (
            <div key={todo._id} className="todo-item">
              <div className="todo-content">
                <span className="todo-text">{todo.text}</span>
              </div>
              <div className="todo-actions">
                <button
                  onClick={() => openEditModal(todo)}
                  className="update-button"
                >
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="delete-button"
                >
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {todos.length === 0 && (
            <div className="no-todos">
              <i className="fas fa-clipboard-list"></i>
              <p>No tasks yet. Add one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoPage;
