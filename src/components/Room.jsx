import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { addRoom, deleteRoom, fetchRooms } from "../features/room/roomSlice";
import { getAllBuildings } from "../features/building/buildingSlice";

const Room = () => {
  const dispatch = useDispatch();
  const room = useSelector((state) => state.room.rooms);
  const buildings = useSelector((state) => state.building.building);

  // Form state
  const [formData, setFormData] = useState({
    roomName: "",
    roomType: "non-ac",
    numberSharedRoom: "",
    buildingId: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllBuildings());
    dispatch(fetchRooms());
  }, [dispatch]);

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    roomName: Yup.string().required("Room name is required"),
    roomType: Yup.string().required("Please select a room type"),
    numberSharedRoom: Yup.string().required("Please enter the number of shared rooms"),
    buildingId: Yup.string().required("Please select a building"),
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setLoading(true);

      // Dispatch the addRoom action
      dispatch(addRoom(formData));
      setLoading(false);

      // Reset form
      setFormData({
        roomName: "",
        roomType: "non-ac",
        numberSharedRoom: "",
        buildingId: "",
      });
    } catch (validationErrors) {
      const fieldErrors = {};
      validationErrors.inner.forEach((error) => {
        fieldErrors[error.path] = error.message;
      });
      setErrors(fieldErrors);
    }
  };

  // Handle delete room with confirmation
  const handleDelete = (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      dispatch(deleteRoom(roomId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-800 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Room</h2>
        <form onSubmit={handleSubmit}>
          {/* Room Name */}
          <div className="mb-4">
            <label htmlFor="roomName" className="block text-sm font-medium text-gray-300">
              Room Name
            </label>
            <input
              type="text"
              id="roomName"
              name="roomName"
              value={formData.roomName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              aria-describedby="roomNameError"
            />
            {errors.roomName && (
              <div id="roomNameError" className="text-red-500 text-sm mt-1">
                {errors.roomName}
              </div>
            )}
          </div>

          {/* Room Type */}
          <div className="mb-4">
            <label htmlFor="roomType" className="block text-sm font-medium text-gray-300">
              Room Type
            </label>
            <select
              id="roomType"
              name="roomType"
              value={formData.roomType}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
            >
              <option value="non-ac">Non-AC</option>
              <option value="ac">AC</option>
            </select>
            {errors.roomType && (
              <div className="text-red-500 text-sm mt-1">{errors.roomType}</div>
            )}
          </div>

          {/* Number of Shared Rooms */}
          <div className="mb-4">
            <label htmlFor="numberSharedRoom" className="block text-sm font-medium text-gray-300">
              Number of Shared Rooms
            </label>
            <input
              type="text"
              id="numberSharedRoom"
              name="numberSharedRoom"
              value={formData.numberSharedRoom}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
            />
            {errors.numberSharedRoom && (
              <div className="text-red-500 text-sm mt-1">{errors.numberSharedRoom}</div>
            )}
          </div>

          {/* Building Selection */}
          <div className="mb-4">
            <label htmlFor="buildingId" className="block text-sm font-medium text-gray-300">
              Building
            </label>
            <select
              id="buildingId"
              name="buildingId"
              value={formData.buildingId}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
            >
              <option value="">Select a building</option>
              {buildings.map((building) => (
                <option key={building._id} value={building._id}>
                  {building.name}
                </option>
              ))}
            </select>
            {errors.buildingId && (
              <div className="text-red-500 text-sm mt-1">{errors.buildingId}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            >
              {loading ? "Adding Room..." : "Add Room"}
            </button>
          </div>
        </form>

        {/* Room Data Table */}
        <div className="mt-8 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Room Data</h3>
          {room.length > 0 ? (
            <table className="min-w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Room Name</th>
                  <th className="py-2 px-4 border-b text-left">Room Type</th>
                  <th className="py-2 px-4 border-b text-left">Shared Rooms</th>
                  <th className="py-2 px-4 border-b text-left">Building</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {room.map((roomItem) => (
                  <tr key={roomItem._id}>
                    <td className="py-2 px-4 border-b">{roomItem.roomName}</td>
                    <td className="py-2 px-4 border-b">{roomItem.roomType}</td>
                    <td className="py-2 px-4 border-b">{roomItem.numberSharedRoom}</td>
                    <td className="py-2 px-4 border-b">
                      {buildings.find((b) => b._id === roomItem.buildingId)?.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleDelete(roomItem._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">No rooms found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
