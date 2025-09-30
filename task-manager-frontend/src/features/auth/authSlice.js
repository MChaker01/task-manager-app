import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// 1. On essaie de récupérer l'utilisateur du localStorage au démarrage
const user = JSON.parse(localStorage.getItem("user"));

// 2. On définit l'état initial de cette "tranche"

const initialState = {
  user: user ? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Créer l'action asynchrone pour l'inscription
export const register = createAsyncThunk(
  "auth/register", // 1. Un nom pour cette action

  // 2. La fonction qui fait le travail
  async (user, thunkAPI) => {
    try {
      return await authService.register(user); // Appelle notre service
    } catch (error) {
      const message = error.response.data.message || error.toString();

      return thunkAPI.rejectWithValue(message); // En cas d'erreur, renvoie un message
    }
  }
);

// Créer l'action asynchrone pour la déconnexion
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,

  // 3. Les "reducers" sont des fonctions qui modifient l'état
  reducers: {
    // On pourra appeler cette fonction pour réinitialiser l'état
    reset: (state) => {
      (state.isLoading = false),
        (state.isSuccess = false),
        (state.isError = false),
        (state.message = "");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true; // Quand l'inscription commence, on passe en mode chargement
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false; // Le chargement est terminé
        state.isSuccess = true; // C'est un succès !
        state.user = action.payload; // On met à jour l'utilisateur avec les données reçues de l'API
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false; // Le chargement est terminé
        state.isError = true; // C'est une erreur !
        state.message = action.payload; // On stocke le message d'erreur
        state.user = null; // En cas d'échec, on s'assure que l'utilisateur est null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

// On exporte notre action 'reset' pour pouvoir l'utiliser plus tard
export const { reset } = authSlice.actions;
// On exporte le reducer principal du slice
export default authSlice.reducer;
