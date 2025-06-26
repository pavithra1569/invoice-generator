import { createSlice } from "@reduxjs/toolkit";
import { logoutUser, loadUser } from "../actions/thunks"; // ✅ fixed import

const initialState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    },
    loginFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    registerRequest(state) {
      state.loading = true;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
      logoutSuccess(state) {
    state.loading = false;
    state.isAuthenticated = false;
    state.user = null;
    state.error = null;
  },
  },

  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  registerRequest,
  registerSuccess,
  registerFail,
  clearError,
  logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;
