// src/actions/thunks.js
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// LOGOUT
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const response = await axios.get("http://localhost:4100/logout");
  return response.data;
});

// LOAD USER
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:4100/profile");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load user");
    }
  }
);
