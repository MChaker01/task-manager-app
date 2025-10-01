import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "./taskService";

const initialState = {
  tasks: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// 1. Action asynchrone : Créer une tâche
export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, thunkAPI) => {
    try {
      return await taskService.createTask(taskData);
    } catch (error) {
      const message = error.response?.data?.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2. Action asynchrone : Récupérer toutes les tâches
export const getTasks = createAsyncThunk("tasks/getTasks", async (thunkAPI) => {
  try {
    return await taskService.getTasks();
  } catch (error) {
    const message = error.response?.data?.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// 3. Action asynchrone : Récupérer une tâche
export const getTask = createAsyncThunk(
  "tasks/getTask",
  async (taskId, thunkAPI) => {
    try {
      return await taskService.getTask(taskId);
    } catch (error) {
      const message = error.response?.data?.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4. Action asynchrone : Modifier une tâche
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ taskId, taskData }, thunkAPI) => {
    try {
      return await taskService.updateTask(taskId, taskData);
    } catch (error) {
      const message = error.response?.data?.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 5. Action asynchrone : Supprimer une tâche
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (taskId, thunkAPI) => {
    try {
      return await taskService.deleteTask(taskId);
    } catch (error) {
      const message = error.response?.data?.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Créer le slice
export const taskSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {
    reset: (state) => {
      (state.isLoading = false),
        (state.isSuccess = false),
        (state.isError = false),
        (state.message = "");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.push(action.payload.task);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = state.tasks.map((task) => {
          return task._id === action.payload.task._id
            ? action.payload.task
            : task;
        });
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload.id
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.tasks = state.tasks.filter((task) => {
        //     task._id === action.payload.id;
        // });
      })
      .addCase(getTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;
