import { useState, useEffect } from 'react';
import '../styles/Todo.css';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = "https://backends-xvqm.onrender.com";

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      });
      const data = await response.json();
      setTodos([data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editText.trim() || !editingTodo) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${editingTodo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => (todo._id === editingTodo._id ? updatedTodo : todo)));
      closeEditModal();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="todo-container">
        <h1>Task Manager</h1>
        <form onSubmit={handleSubmit} className="todo-form">
          <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="What needs to be done?" />
          <button type="submit">Add Task</button>
        </form>
        <div className="todo-list">
          {todos.map((todo) => (
            <div key={todo._id}>
              <span>{todo.text}</span>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TodoPage;