import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
  rooms: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all rooms
export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("No authentication token found.");
      }

      const response = await axios.get("/api/room", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch rooms."
      );
    }
  }
);

// Async thunk to add a room
export const addRoom = createAsyncThunk(
  "rooms/addRoom",
  async (roomData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("No authentication token found.");
      }

      const response = await axios.post(
        "/api/room",
        roomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Return the added room data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add room."
      );
    }
  }
);

// Async thunk to delete a room by ID
export const deleteRoom = createAsyncThunk(
  "rooms/deleteRoom",
  async (roomId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("No authentication token found.");
      }

      await axios.delete(`/api/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return roomId; // Return the deleted room ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete room."
      );
    }
  }
);

// Slice for room management
const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add room
      .addCase(addRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.unshift(action.payload); // Add the new room to the top of the list
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete room
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter((room) => room._id!== action.payload);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roomSlice.reducer;
