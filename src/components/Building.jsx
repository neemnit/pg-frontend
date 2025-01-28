import { useEffect, useState } from "react";
import * as Yup from "yup";
import { deleteBuilding, fetchBuildings, getAllBuildings } from "../features/building/buildingSlice";
import { useDispatch, useSelector } from "react-redux";

const Building = () => {
  const dispatch = useDispatch();

  // Redux state
  const { building: buildings, loading, error } = useSelector((state) => state.building);

  // Local states
  const [formData, setFormData] = useState({
    ownerName: "",
    name: "",
    address: "",
    landMark: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Fetch all buildings on mount
  useEffect(() => {
    dispatch(getAllBuildings());
  }, [dispatch]);

  const schema = Yup.object().shape({
    ownerName: Yup.string()
      .required("Please give owner name")
      .max(50, "Owner name must not exceed 50 characters"),
    name: Yup.string()
      .required("Name is required")
      .max(50, "Name must not exceed 50 characters"),
    address: Yup.string().required("Address is required"),
    landMark: Yup.string().required("Landmark is required"),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const formErrors = {};
      err.inner.forEach((error) => {
        formErrors[error.path] = error.message;
      });
      setErrors(formErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      setSubmitting(true);
      try {
        const resultAction = await dispatch(fetchBuildings({ BuildingData: formData }));
        if (fetchBuildings.rejected.match(resultAction)) {
          setApiError(resultAction.payload || "Failed to add building. Please try again.");
        } else {
          // Re-fetch the buildings to get the updated list
          dispatch(getAllBuildings());
          setFormData({
            ownerName: "",
            name: "",
            address: "",
            landMark: "",
          });
          setShowNotification(true); // Show success notification
          setTimeout(() => setShowNotification(false), 2000); // Hide notification after 3 seconds
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setApiError("Failed to add building. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteBuilding(id));
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 text-white min-h-screen">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-bounce">
          Building added successfully!
        </div>
      )}

      {/* Form Section */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-full max-w-xl p-4 sm:p-6 bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-100">Building Form</h2>
          {apiError && (
            <div className="text-red-500 text-sm mb-4 border border-red-500 bg-red-100 p-2 rounded-md">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ownerName" className="block font-medium mb-1 text-gray-200">
                Owner Name
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 ${
                  errors.ownerName ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-400"
                }`}
              />
              {errors.ownerName && (
                <p className="text-red-400 text-sm mt-1">{errors.ownerName}</p>
              )}
            </div>
            <div>
              <label htmlFor="name" className="block font-medium mb-1 text-gray-200">
                Building Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-400"
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block font-medium mb-1 text-gray-200">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 ${
                  errors.address ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-400"
                }`}
                style={{ resize: "none" }}
              />
              {errors.address && (
                <p className="text-red-400 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <label htmlFor="landMark" className="block font-medium mb-1 text-gray-200">
                Landmark
              </label>
              <input
                type="text"
                id="landMark"
                name="landMark"
                value={formData.landMark}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 ${
                  errors.landMark ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-400"
                }`}
              />
              {errors.landMark && (
                <p className="text-red-400 text-sm mt-1">{errors.landMark}</p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-md ${
                submitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              } text-white`}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-100">Building List</h2>
        {loading ? (
          <p className="text-center text-blue-400">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-400">Error: {error}</p>
        ) : buildings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-700">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="border border-gray-600 px-2 sm:px-4 py-2">Owner Name</th>
                  <th className="border border-gray-600 px-2 sm:px-4 py-2">Building Name</th>
                  <th className="border border-gray-600 px-2 sm:px-4 py-2">Address</th>
                  <th className="border border-gray-600 px-2 sm:px-4 py-2">Landmark</th>
                  <th className="border border-gray-600 px-2 sm:px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buildings.map((building, index) => (
                  <tr key={index} className="text-center odd:bg-gray-800 even:bg-gray-700">
                    <td className="border border-gray-600 px-2 sm:px-4 py-2">{building.ownerName}</td>
                    <td className="border border-gray-600 px-2 sm:px-4 py-2">{building.name}</td>
                    <td className="border border-gray-600 px-2 sm:px-4 py-2">{building.address}</td>
                    <td className="border border-gray-600 px-2 sm:px-4 py-2">{building.landMark}</td>
                    <td className="border border-gray-600 px-2 sm:px-4 py-2">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        onClick={() => handleDelete(building._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400">No buildings found.</p>
        )}
      </div>
    </div>
  );
};

export default Building;
