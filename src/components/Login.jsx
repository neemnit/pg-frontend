import { useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const Login = ({handleAuth}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // Yup validation schema for login
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email or Name is required")
      .max(50, "Must be 50 characters or less"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate field in real-time
    validationSchema
      .validateAt(name, { ...formData, [name]: value })
      .then(() => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
      })
      .catch((err) => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }));
      });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate the form
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({}); // Clear validation errors

      // Dispatch the action for login
      const resultAction = await dispatch(
        loginUser({ formData,handleAuth, redirectToDashboard })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        
        setApiError(null);
      } else if (loginUser.rejected.match(resultAction)) {
        setApiError(resultAction.payload || "Failed to login. Please try again.");
      }
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
    }
  };

  // Redirect to the dashboard page after successful login
  function redirectToDashboard() {
    
    navigate("/addbuilding");
  }

  return (
    <div className="text-center mt-6">
      <h1 className="text-3xl text-blue-600 font-bold">Login to the system</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mx-auto mt-5 w-[400px]"
      >
        <div className="mb-4">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter name or email"
            className="p-2 border rounded-sm outline-1 focus:outline-emerald-700 placeholder-black w-full"
          />
          {errors.email && (
            <div className="text-red-500 text-sm mt-1">{errors.email}</div>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="p-2 border rounded-sm outline-1 focus:outline-emerald-700 placeholder-black w-full"
          />
          {errors.password && (
            <div className="text-red-500 text-sm mt-1">{errors.password}</div>
          )}
        </div>

        {apiError && (
          <div className="text-red-500 text-sm mb-4">{apiError}</div>
        )}

        <input
          type="submit"
          className="mt-2 p-3 border rounded-sm bg-sky-600 text-white hover:bg-black hover:text-white"
        />
      </form>
    </div>
  );
};
Login.propTypes={
  handleAuth:PropTypes.func.isRequired
}
export default Login;





























