const mongoose = require("mongoose");

/**
 * Schéma Mongoose pour les utilisateurs
 * Définit la structure et les règles de validation pour chaque utilisateur
 */
const UserSchema = mongoose.Schema(
  {
    // Nom d'utilisateur
    username: {
      type: String,
      required: true, // Obligatoire
      trim: true, // Supprime les espaces au début et à la fin
    },

    // Email (utilisé pour la connexion)
    email: {
      type: String,
      required: true,
      unique: true, // Chaque email doit être unique dans la BDD
      trim: true,
      // Validation par regex pour s'assurer que c'est un format email valide
      match: [/.+@.+\..+/, "Veuillez entrer une adresse email valide"],
    },

    // Mot de passe (haché avec bcrypt)
    password: {
      type: String,
      required: true,
      // NOTE : Le mot de passe sera haché dans le controller AVANT d'être sauvegardé
      // On ne stocke JAMAIS les mots de passe en clair dans la BDD
    },
  },
  {
    timestamps: true, // ajout automatique de createdAt et updatedAt
  }
);

// Créer et exporter le modèle User
// 'User' sera le nom de la collection dans MongoDB (au pluriel : 'users')
const User = mongoose.model("User", UserSchema);

module.exports = User;
