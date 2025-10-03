import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTasks, deleteTask } from "../features/tasks/taskSlice";
import Spinner from "../components/Spinner";
import TaskList from "../components/TaskList";
import TaskForm from "./../components/TaskForm";
import "../assets/styles/dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Récupérer les tâches et les états depuis Redux
  const { tasks, isError, isLoading, message } = useSelector(
    (state) => state.tasks
  );

  const [showModal, setShowModal] = useState(false); // true/false pour afficher/cacher le modal
  const [editingTask, setEditingTask] = useState(null); // null (mode création) ou objet task (mode édition)

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard">
      <h1>My Tasks</h1>

      <button onClick={handleOpenCreateModal}>New Task</button>

      {isError && <div className="error-message">{message}</div>}

      {tasks.length === 0 ? (
        <div className="empty-list">List of Tasks is Empty.</div>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      {showModal && (
        <TaskForm taskToEdit={editingTask} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Dashboard;
