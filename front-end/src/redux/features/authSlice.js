import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: !!localStorage.getItem("user"),
    userLogin: JSON.parse(localStorage.getItem("user")) || {},
    loading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    login: (state, action) => {
      // Đổi tên từ loginSuccess thành login
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.isLoggedIn = true;
      state.userLogin = action.payload;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.isLoggedIn = false;
      state.userLogin = {};
    },
  },
});

export const { loginStart, login, loginFailure, logout } = authSlice.actions; // Đổi tên ở đây
export default authSlice.reducer;
