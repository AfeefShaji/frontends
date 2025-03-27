import { useState } from 'react';

function TodoItem({ todo, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleUpdate = () => {
    if (isEditing && editText.trim()) {
      onUpdate(todo._id, editText);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="todo-item">
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="todo-input"
        />
      ) : (
        <span className="todo-text">{todo.text}</span>
      )}
      <div className="todo-actions">
        <button
          onClick={handleUpdate}
          className="todo-button update-button"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button
          onClick={() => onDelete(todo._id)}
          className="todo-button delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TodoItem; 