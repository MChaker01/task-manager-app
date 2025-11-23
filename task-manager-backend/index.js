// --- Importer les modules ---

// Charger les variables d'environnement depuis le fichier .env
// Doit être appelé en PREMIER pour que process.env.PORT, DB_URI, etc. soient disponibles
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// --- Importer les routes ---
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

// --- Créer l'application Express ---
const app = express();

// --- Middlewares Globaux ---

// 1. Permet de parser (analyser) le JSON dans le corps des requêtes
// Sans ça, req.body serait undefined
app.use(express.json());

// 2. Permet de parser les données de formulaires URL-encodées
// extended: true permet d'accepter des objets/tableaux complexes
app.use(express.urlencoded({ extended: true }));

// 3. CORS (Cross-Origin Resource Sharing)
// Permet au frontend (sur un autre port) de faire des requêtes vers ce backend
// Sans ça, le navigateur bloquerait les requêtes (politique de sécurité)
app.use(cors());

// --- Définir les Routes ---

// Toutes les routes commençant par /api/users seront gérées par userRoutes
app.use("/api/users", userRoutes);

// Toutes les routes commençant par /api/tasks seront gérées par taskRoutes
app.use("/api/tasks", taskRoutes);

// --- Connexion à MongoDB ---

const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully.");

    // Start the server ONLY if the connection to the database was successful
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server successfully started on port ${PORT}`);
      console.log(`📍 Local access : http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Stop the process if the database does not connect
  });
