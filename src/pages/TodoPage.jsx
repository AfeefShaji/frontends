import { useState, useEffect } from 'react';
import '../styles/Todo.css';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Add new todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/todos', {
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
      await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingTodo(null);
    setEditText('');
    setIsModalOpen(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editText.trim() || !editingTodo) return;

    try {
      const response = await fetch(`http://localhost:5000/api/todos/${editingTodo._id}`, {
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
                <span className="todo-date">
                  <i className="far fa-calendar-alt"></i>
                  {formatDate(todo.createdAt)}
                </span>
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

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Edit Task</h2>
                <button onClick={closeEditModal} className="modal-close">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleUpdate} className="edit-form">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Update your task"
                  className="edit-input"
                  autoFocus
                />
                <div className="modal-actions">
                  <button type="button" onClick={closeEditModal} className="cancel-button">
                    Cancel
                  </button>
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoPage; 