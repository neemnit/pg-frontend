import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { addTenant, deleteTenant, fetchTenants } from "../features/tenant/tenantSlice";
import { getAllBuildings } from "../features/building/buildingSlice";
import { fetchRooms } from "../features/room/roomSlice";

const Tenant = () => {
  const tenants = useSelector((state) => state.tenant.tenants);
  const rooms = useSelector((state) => state.room.rooms);
  const buildings = useSelector((state) => state.building.building);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBuildings());
    dispatch(fetchRooms());
    dispatch(fetchTenants());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    aadhar: "",
    mobile: "",
    roomId: "",
    buildingId: "",
  });

  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    aadhar: Yup.string()
      .matches(/^\d{12}$/, "Aadhar must be exactly 12 digits")
      .required("Aadhar is required"),
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
    roomId: Yup.string().required("Room is required"),
    buildingId: Yup.string().required("Building is required"),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear roomId if buildingId changes
    if (name === "buildingId") {
      setFormData((prev) => ({ ...prev, roomId: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      dispatch(addTenant(formData));
      setFormData({
        name: "",
        aadhar: "",
        mobile: "",
        roomId: "",
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

  const handleDelete = (tenantId) => {
    dispatch(deleteTenant(tenantId));
  };

  // Filter rooms based on the selected building
  const filteredRooms = rooms.filter((room) => room.buildingId === formData.buildingId);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Tenant</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
            />
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="aadhar" className="block text-sm font-medium text-gray-300">
              Aadhar Number
            </label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
            />
            {errors.aadhar && <div className="text-red-500 text-sm mt-1">{errors.aadhar}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-300">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
            />
            {errors.mobile && <div className="text-red-500 text-sm mt-1">{errors.mobile}</div>}
          </div>

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
            {errors.buildingId && <div className="text-red-500 text-sm mt-1">{errors.buildingId}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-300">
              Room
            </label>
            <select
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleInputChange}
              disabled={!formData.buildingId} // Disable until building is selected
              className={`mt-1 block w-full p-2 border ${
                formData.buildingId ? "border-gray-600" : "border-gray-400"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white`}
            >
              <option value="">Select a room</option>
              {filteredRooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.roomName}
                </option>
              ))}
            </select>
            {errors.roomId && <div className="text-red-500 text-sm mt-1">{errors.roomId}</div>}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Add Tenant
            </button>
          </div>
        </form>

        <div className="mt-8 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Tenant Data</h3>
          <table className="min-w-full bg-gray-800 border border-gray-600 shadow-lg rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Aadhar</th>
                <th className="py-2 px-4 border-b text-left">Mobile</th>
                <th className="py-2 px-4 border-b text-left">Room</th>
                <th className="py-2 px-4 border-b text-left">Building</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant._id}>
                  <td className="py-2 px-4 border-b">{tenant.name}</td>
                  <td className="py-2 px-4 border-b">{tenant.aadhar}</td>
                  <td className="py-2 px-4 border-b">{tenant.mobile}</td>
                  <td className="py-2 px-4 border-b">
                    {rooms.find((room) => room._id === tenant.roomId)?.roomName}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {buildings.find((building) => building._id === tenant.buildingId)?.name}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDelete(tenant._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tenant;
