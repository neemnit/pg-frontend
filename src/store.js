import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import buildingReducer from "./features/building/buildingSlice";
import roomReducer from "./features/room/roomSlice"
import tenantReducer from "./features/tenant/tenantSlice"
const store = configureStore({
  reducer: {
    user: userReducer,
    building: buildingReducer, // Make sure buildingReducer is included
    room:roomReducer,
    tenant:tenantReducer
  },
});

 // Logs the initial state of the store

export default store;
