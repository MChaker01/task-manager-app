import React from "react";

const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <div className="task-item">
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <span className="status">{task.status}</span>
        {task.dueDate && (
          <span className="due-date">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task)}>Modifier</button>
        <button onClick={() => onDelete(task._id)}>Supprimer</button>
      </div>
    </div>
  );
};

export default TaskItem;
