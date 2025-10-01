import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import taskReducer from "../features/tasks/taskSlice";

export const store = configureStore({
  reducer: {
    // 2. On connecte notre slice au store.
    auth: authReducer,
    tasks: taskReducer,
  },
});
