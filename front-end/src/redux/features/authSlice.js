import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userLogin: {},
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userLogin = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userLogin = {};
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
