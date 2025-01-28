import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
  loading: false,
  error: "",
  building: [],
};

// Thunk for adding a new building
export const fetchBuildings = createAsyncThunk(
  "building/fetchBuildings",
  async ({ BuildingData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue("No auth token found. Please log in.");
      }

      const response = await axios.post(
        "/api/building",
        BuildingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        return response.data;
      } else {
        return rejectWithValue("No buildings data received.");
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch buildings"
        );
      }
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Thunk for fetching all buildings (GET request)
export const getAllBuildings = createAsyncThunk(
  "building/getAllBuildings",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue("No auth token found. Please log in.");
      }

      const response = await axios.get("/api/building", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        return response.data;
      } else {
        return rejectWithValue("No buildings data received.");
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch all buildings"
        );
      }
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Thunk for deleting a building by ID
export const deleteBuilding = createAsyncThunk(
  "building/deleteBuilding",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue("No auth token found. Please log in.");
      }

      const response = await axios.delete(
        `/api/building/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If successful, return the deleted building ID to update the state
      if (response.data) {
        return id; // Return the ID of the deleted building
      } else {
        return rejectWithValue("Failed to delete building.");
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to delete building."
        );
      }
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const buildingSlice = createSlice({
  name: "building",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling adding a building
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.building.unshift(action.payload)
      
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.building = [];
      })

      // Handling fetching all buildings
      .addCase(getAllBuildings.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAllBuildings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.building = action.payload;
      })
      .addCase(getAllBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.building = [];
      })

      // Handling deleting a building
      .addCase(deleteBuilding.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteBuilding.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        // Remove the deleted building from the list using _id
        state.building = state.building.filter(
          (building) => building._id !== action.payload
        );
      })
      .addCase(deleteBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default buildingSlice.reducer;



