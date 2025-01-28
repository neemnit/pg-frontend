import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";
import { getAllBuildings } from "../building/buildingSlice";
import { fetchRooms } from "../room/roomSlice";
import { fetchTenants } from "../tenant/tenantSlice";
const initialState = {
  loading: false,
  error: "",
  users: [],
};

// Create an async thunk for registering a user
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async ({ formData, redirectToLogin }, { rejectWithValue }) => {
    try {
      // Send the registration request
      const response = await axios.post(
        "/api/user/register",
        formData, // Pass the form data directly
        {
          headers: { "Content-Type": "application/json" }, // JSON Content-Type
        }
      );

      // Check the response structure for debugging
      

      // Assuming response.data contains user data (adjust as needed)
      if (response.data) {
        redirectToLogin(); // Redirect after successful registration
        return response.data; // Return the user data
      } else {
        return rejectWithValue("No user data received.");
      }
    } catch (error) {
      // Handle network or server errors
      console.error("Error during registration:", error);
      if (error.response) {
        // Server-side error
        return rejectWithValue(error.response.data.message || "Failed to register user");
      } else {
        // Network or unknown errors
        return rejectWithValue(error.message || "Something went wrong");
      }
    }
  }
);

// Create an async thunk for logging in
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ formData, handleAuth, redirectToDashboard }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/user/login",
        formData, // Pass the form data directly
        {
          headers: { "Content-Type": "application/json" }, // JSON Content-Type
        }
      );

      const data = response.data;

      // Store the token in localStorage
      localStorage.setItem("authToken", data.token);

      // Call the redirectToDashboard after successful login
      handleAuth();
      redirectToDashboard();
      getAllBuildings()
      fetchRooms()
      fetchTenants()

      return data; // Return the response data
    } catch (error) {
      if (error.response) {
        // Handle server-side errors
        return rejectWithValue(error.response.data.message || "Failed to log in");
      }
      // Handle network or other errors
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Create an async thunk for fetching user data
export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      // Make a GET request to fetch users without the Authorization header
      const response = await axios.get(
        "/api/user", // Assuming this endpoint returns all users
      );

      // Check the response structure for debugging
      

      if (response.data) {
        return response.data; // Return the users data
      } else {
        return rejectWithValue("No users found.");
      }
    } catch (error) {
      // Handle errors during the request
      console.error("Error fetching users:", error);
      if (error.response) {
        return rejectWithValue(error.response.data.message || "Failed to fetch users");
      }
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);


// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
          // For debugging
        state.users.unshift(action.payload);  // Add the new user at the beginning of the array
        state.loading = false;
        state.error = "";
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
         // For debugging
        state.users = action.payload; // Set the fetched users in the state
        state.loading = false;
        state.error = "";
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      });
  },
});

export default userSlice.reducer;
