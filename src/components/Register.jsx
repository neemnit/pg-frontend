import { useState ,useEffect} from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, getUsers } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";


const Register = () => {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
     dispatch(getUsers())
    },[])
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const user = useSelector((state) => state.user.users);


    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);

    // Redirect to login function
    function redirectToLogin() {
        navigate("/login");
    }

    // Yup schema for validation
    const validationSchema = Yup.object({
        name: Yup.string()
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name can't exceed 50 characters")
            .required("Name is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .matches(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character"
            )
            .required("Password is required"),
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

    // Validate the entire form
    const validateForm = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach((error) => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await validateForm();
        if (isValid) {
            try {
                const resultAction = await dispatch(fetchUsers({ formData, redirectToLogin }));
                if (fetchUsers.rejected.match(resultAction)) {
                    setApiError(
                        resultAction.payload || "Failed to register. Please try again."
                    );
                }
            } catch (error) {
                console.error("Unexpected error:", error);
                setApiError("Failed to register. Please try again.");
            }
        }
    };

    return (
        <div className="mx-auto text-center bg-slate-100 h-[35rem] flex items-center justify-center">
            {user.loading && <div>Loading...</div>}
            {!user.loading && user.error ? <div>Error: {user.error}</div> : null}
            <div>
                <h1 className="text-3xl text-red-600 mb-4">Register Yourself</h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-400 border-2 border-rose-300 mx-auto max-w-lg p-8 rounded-lg"
                >
                    <div className="mb-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="placeholder-gray-700 w-full outline-none border p-2 focus:translate-x-1 focus:translate-y-1 transition-transform duration-200"
                            placeholder="Enter your name"
                        />
                        {errors.name && (
                            <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="placeholder-gray-700 w-full outline-none border p-2 focus:translate-x-1 focus:translate-y-1 transition-transform duration-200"
                            placeholder="Enter your email"
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
                            className="placeholder-gray-700 w-full outline-none border p-2 focus:translate-x-1 focus:translate-y-1 transition-transform duration-200"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                        )}
                    </div>

                    {apiError && (
                        <div className="text-red-500 text-sm mb-4">{apiError}</div>
                    )}

                    <button
                        type="submit"
                        className="bg-blue-700 text-white p-2 w-full rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
