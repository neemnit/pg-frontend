import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";

// Initial state for tenants
const initialState = {
  tenants: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all tenants
export const fetchTenants = createAsyncThunk(
  "tenants/fetchTenants",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("No authentication token found.");
      }

      const response = await axios.get("/api/tenant", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tenants."
      );
    }
  }
);

// Async thunk to add a tenant
export const addTenant = createAsyncThunk(
  "tenants/addTenant",
  async (tenantData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("No authentication token found.");
      }

      const response = await axios.post(
        "/api/tenant",
        tenantData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Return the added tenant data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add tenant."
      );
    }
  }
);

// Async thunk to delete a tenant by ID
export const deleteTenant = createAsyncThunk(
  "tenants/deleteTenant",
  async (tenantId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("No authentication token found.");
      }

      await axios.delete(`/api/tenant/${tenantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return tenantId; // Return the deleted tenant ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete tenant."
      );
    }
  }
);

// Slice for tenant management
const tenantSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tenants
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add tenant
      .addCase(addTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants.unshift(action.payload); // Add the new tenant to the top of the list
      })
      .addCase(addTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete tenant
      .addCase(deleteTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = state.tenants.filter(
          (tenant) => tenant._id !== action.payload
        );
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tenantSlice.reducer;
