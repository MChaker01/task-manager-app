import axios from "axios";

const API_URL = "http://localhost:3000/api/tasks";

const getAuthConfig = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  }

  return {};
};

// Créer une tâche :
const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData, getAuthConfig());

  return response.data;
};

// Récupérer toutes les tâches :
const getTasks = async () => {
  const response = await axios.get(API_URL, getAuthConfig());

  return response.data;
};

// Récupérer une seule tâche :
const getTask = async (taskId) => {
  const response = await axios.get(API_URL + `/${taskId}`, getAuthConfig());

  return response.data;
};

// Supprimer une tâche :
const deleteTask = async (taskId) => {
  const response = await axios.delete(API_URL + `/${taskId}`, getAuthConfig());

  return response.data;
};

// modifier une tâche :
const updateTask = async (taskId, taskData) => {
  const response = await axios.put(
    API_URL + `/${taskId}`,
    taskData,
    getAuthConfig()
  );

  return response.data;
};

const taskService = {
  createTask,
  getTasks,
  getTask,
  deleteTask,
  updateTask,
};

export default taskService;
