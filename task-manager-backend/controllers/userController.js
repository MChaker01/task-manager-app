const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @desc    Inscrire un nouvel utilisateur
 * @route   POST /api/users/register
 * @access  Public (pas besoin d'être connecté)
 */
const registerUser = async (req, res) => {
  try {
    // 1. Récupérer les données du formulaire
    const { username, email, password } = req.body;

    // 2. Validation : vérifier que tous les champs sont remplis
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs." });
    }

    // 3. Vérifier si l'email existe déjà dans la BDD
    const userExists = await User.findOne({ email });

    if (userExists) {
      // 409 = Conflict (l'utilisateur existe déjà)
      return res
        .status(409)
        .json({ message: "Un compte existe déjà avec cet email." });
    }

    // 4. HACHAGE DU MOT DE PASSE (sécurité)
    // Étape 1 : Générer un "sel" (salt) - une chaîne aléatoire
    // Le nombre 10 = le "coût" du hachage (plus c'est élevé, plus c'est sécurisé mais lent)
    const passwordSalt = await bcrypt.genSalt(10);

    // Étape 2 : Hacher le mot de passe avec ce sel
    // Le hash résultant est une longue chaîne qui ne peut pas être "dé-hachée"
    const hashedPassword = await bcrypt.hash(password, passwordSalt);

    // 5. Créer l'utilisateur dans MongoDB avec le mot de passe haché
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword, // On stocke le hash, JAMAIS le mot de passe en clair
    });

    // 6. Si la création a réussi, générer un token JWT
    if (newUser) {
      // jwt.sign() crée un token en 3 parties :
      // - Payload : les données qu'on veut encoder (ici l'ID de l'utilisateur)
      // - Secret : clé secrète pour signer le token (doit être gardée privée)
      // - Options : durée de validité, algorithme, etc.
      const token = jwt.sign(
        { id: newUser._id }, // Payload : on met l'ID de l'utilisateur
        process.env.JWT_SECRET, // Secret depuis .env
        { expiresIn: "30d" } // Le token expire dans 30 jours
      );

      // 7. Renvoyer les infos de l'utilisateur + le token au frontend
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        token, // Le frontend stockera ce token dans localStorage
      });
    } else {
      return res
        .status(400)
        .json({ message: "Données utilisateur invalides." });
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement d'utilisateur:", error);

    res.status(500).json({
      message: "Erreur serveur lors de l'inscription.",
      error: error.message,
    });
  }
};

/**
 * @desc    Authentifier un utilisateur (connexion)
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    // 1. Récupérer email et mot de passe du formulaire
    const { email, password } = req.body;

    // 2. Chercher l'utilisateur par email dans la BDD
    const user = await User.findOne({ email });

    // 3. Vérifier si l'utilisateur existe ET si le mot de passe est correct
    // bcrypt.compare() compare le mot de passe en clair avec le hash stocké
    if (user && (await bcrypt.compare(password, user.password))) {
      // 4. Connexion réussie : générer un nouveau token
      const token = jwt.sign(
        { id: user._id }, // Payload
        process.env.JWT_SECRET, // Secret
        { expiresIn: "30d" } // Options
      );

      // 5. Renvoyer les infos + token
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    } else {
      // Si l'email n'existe pas OU le mot de passe est incorrect
      // On ne précise pas lequel pour des raisons de sécurité
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la connexion." });
  }
};

/**
 * @desc    Obtenir les informations de l'utilisateur connecté
 * @route   GET /api/users/me
 * @access  Private (protégé par le middleware 'protect')
 */
const getMe = async (req, res) => {
  // req.user a été ajouté par le middleware 'protect'
  // Il contient toutes les infos de l'utilisateur (sauf le password)
  res.status(200).json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
