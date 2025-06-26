import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  clearError,
  loginFail,
  loginRequest,
  loginSuccess,
  registerFail,
  registerRequest,
  registerSuccess,
  logoutSuccess,
} from "../slices/authSlice";

// LOGIN
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`http://localhost:4100/login`, {
      email,
      password,
    });
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message || "Login failed"));
  }
};

// REGISTER
export const register = (formData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const { data } = await axios.post(`http://localhost:4100/register`, formData);
    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFail(error.response?.data?.message || "Registration failed"));
  }
};

// CLEAR ERROR
export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
};

// LOGOUT

export const logoutUser = () => async (dispatch) => {
 dispatch(logoutSuccess());
};



// LOAD USER
export const loadUser = createAsyncThunk("user/loadUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("http://localhost:4100/profile");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load user");
  }
});
