const Task = require("../models/Task");

/**
 * @desc    Créer une tâche
 * @route   POST /api/tasks
 * @access  Private (protégé par le middleware 'protect')
 */
const createTask = async (req, res) => {
  try {
    // 1. Récupérer les données du formulaire depuis req.body
    const { title, description, status, dueDate } = req.body;

    // 2. Valider les champs obligatoires AVANT de contacter la BDD
    // Le return est CRUCIAL pour arrêter l'exécution si la validation échoue
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Le titre et la description sont obligatoires." });
    }

    // 3. Créer la tâche en associant l'utilisateur connecté
    // req.user.id vient du middleware 'protect' qui a décodé le token JWT
    const newTask = await Task.create({
      title,
      description,
      status: status || "To do", // Valeur par défaut si status n'est pas fourni
      dueDate: dueDate || null, // Valeur par défaut si dueDate n'est pas fournie
      user: req.user.id, // Associe cette tâche à l'utilisateur connecté
    });

    // 4. Renvoyer une réponse de succès avec le code 201 (Created)
    res.status(201).json({
      message: "Tâche créée avec succès.",
      task: newTask,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error);

    // 500 = Erreur serveur (pas 400 qui est pour les erreurs client)
    res.status(500).json({
      message: "Erreur lors de la création de la tâche",
      error: error.message,
    });
  }
};

/**
 * @desc    Récupérer toutes les tâches de l'utilisateur connecté
 * @route   GET /api/tasks
 * @access  Private
 */
const getAllTasks = async (req, res) => {
  try {
    // Récupérer UNIQUEMENT les tâches qui appartiennent à l'utilisateur connecté
    // { user: req.user.id } = filtre MongoDB pour trouver les tâches de cet utilisateur
    const allTasks = await Task.find({ user: req.user.id });

    // Renvoyer le tableau de tâches (même s'il est vide)
    res.status(200).json(allTasks);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);

    res.status(500).json({
      message: "Erreur lors de la récupération des tâches.",
      error: error.message,
    });
  }
};

/**
 * @desc    Récupérer une tâche spécifique par son ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = async (req, res) => {
  try {
    // Trouver la tâche par son ID (fourni dans l'URL)
    const task = await Task.findById(req.params.id);

    // Vérification d'existence
    if (!task) {
      return res.status(404).json({ message: "Tâche introuvable." });
    }

    // SÉCURITÉ : Vérifier que l'utilisateur connecté est bien le propriétaire
    // task.user est un ObjectId, donc on le convertit en string pour la comparaison
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Non autorisé." });
    }

    // Si toutes les vérifications passent, renvoyer la tâche
    res.status(200).json(task);
  } catch (error) {
    console.error("Erreur lors de l'affichage de la tâche:", error);

    res.status(500).json({
      message: "Erreur lors de l'affichage de la tâche.",
      error: error.message,
    });
  }
};

/**
 * @desc    Modifier une tâche par son ID
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    // 1. Trouver la tâche que l'utilisateur veut modifier
    const foundTask = await Task.findById(req.params.id);

    // 2. Vérification d'existence
    if (!foundTask) {
      return res.status(404).json({ message: "Tâche introuvable." });
    }

    // 3. VÉRIFICATION DE SÉCURITÉ CRUCIALE
    // S'assurer que l'utilisateur connecté est bien le propriétaire de la tâche
    if (foundTask.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Non autorisé." });
    }

    // 4. Mettre à jour la tâche avec les nouvelles données de req.body
    // new: true → retourne le document APRÈS modification (pas l'ancien)
    // runValidators: true → applique les validations du schéma Mongoose
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Tâche modifiée avec succès.",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Erreur lors de la modification de la tâche:", error);

    res.status(500).json({
      message: "Erreur lors de la modification.",
      error: error.message,
    });
  }
};

/**
 * @desc    Supprimer une tâche par son ID
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    // 1. Trouver la tâche que l'utilisateur veut supprimer
    const taskToDelete = await Task.findById(req.params.id);

    // 2. Vérification d'existence
    if (!taskToDelete) {
      return res.status(404).json({ message: "Tâche introuvable." });
    }

    // 3. Vérification de propriété
    if (taskToDelete.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Non autorisé." });
    }

    // 4. Supprimer le document trouvé
    await taskToDelete.deleteOne();

    // Renvoyer une confirmation de suppression
    res.status(200).json({
      message: "Tâche supprimée avec succès.",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);

    res.status(500).json({
      message: "Erreur lors de la suppression.",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
};
