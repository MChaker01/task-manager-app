import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createTask, updateTask } from "../features/tasks/taskSlice";
import "../assets/styles/task-form.css";

function TaskForm({ taskToEdit, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To do",
    dueDate: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "",
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("FORMDATA ENVOYÉ:", formData);

    if (taskToEdit) {
      dispatch(
        updateTask({
          taskId: taskToEdit._id,
          taskData: formData,
        })
      );
    } else {
      dispatch(createTask(formData));
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // évite de fermer en cliquant dedans
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">{taskToEdit ? "Edit Task" : "New Task"}</h2>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-inline">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="To do">To do</option>
                <option value="In progress">In progress</option>
                <option value="Finished">Finished</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn">
            Save Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
