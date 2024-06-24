import { configureStore } from "@reduxjs/toolkit";
import { AuthSlice } from "../AuthSlice/authSlice";

export const Store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
  },
});
