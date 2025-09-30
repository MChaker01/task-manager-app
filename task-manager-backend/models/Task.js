const mongoose = require("mongoose");

/**
 * Schéma Mongoose pour les tâches
 * Définit la structure et les règles de validation pour chaque tâche
 */
const TaskSchema = mongoose.Schema(
  {
    // Référence à l'utilisateur propriétaire de cette tâche
    user: {
      type: mongoose.Schema.Types.ObjectId, // Type spécial pour les références
      required: true, // Obligatoire : chaque tâche doit avoir un propriétaire
      ref: "User", // Référence au modèle User (pour le populate si besoin)
    },

    // Titre de la tâche
    title: {
      type: String,
      required: [true, "Veuillez ajouter un titre"], // Message d'erreur personnalisé
      trim: true, // Supprime les espaces au début/fin
    },

    // Description de la tâche
    description: {
      type: String,
      required: [true, "Veuillez ajouter une description"],
      trim: true,
    },

    // Statut de la tâche (avec valeurs limitées)
    status: {
      type: String,
      enum: ["À faire", "En cours", "Terminé"], // Seules ces 3 valeurs sont acceptées
      default: "À faire", // Valeur par défaut si non spécifié
      required: true,
    },

    // Date d'échéance (optionnelle)
    dueDate: {
      type: Date,
      default: null, // null = pas de date d'échéance définie
    },
  },
  {
    timestamps: true, // ajout automatique de createdAt et updatedAt
  }
);

// Créer et exporter le modèle Task
const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
