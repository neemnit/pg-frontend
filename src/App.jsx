import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavLink from "./components/NavLink";
import Register from "./components/Register";
import Login from "./components/Login";
import Building from "./components/Building";
import { useEffect, useState } from "react";
import Room from "./components/Room";
import Tenant from "./components/Tenant";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component

function App() {

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      handleAuth();
    }
  }, []);

  const handleAuth = () => {
    setUserLoggedIn(!userLoggedIn);
  };

  return (
    <div>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <NavLink
              handleAuth={handleAuth}
              userLoggedIn={userLoggedIn}
            />
          }
        >
          <Route path="register" element={<Register />} />
          {/* Protected Routes */}
          <Route 
            path="addbuilding" 
            element={
              <PrivateRoute userLoggedIn={userLoggedIn}>
                <Building />
              </PrivateRoute>
            } 
          />
          <Route 
            path="addroom" 
            element={
              <PrivateRoute userLoggedIn={userLoggedIn}>
                <Room />
              </PrivateRoute>
            } 
          />
          <Route 
            path="addtenant" 
            element={
              <PrivateRoute userLoggedIn={userLoggedIn}>
                <Tenant />
              </PrivateRoute>
            } 
          />
          {/* Login Route */}
          <Route path="login" element={<Login handleAuth={handleAuth} />} />
        </Route>
      </Routes>
    </Router>
      </div>
  );
}

export default App;
