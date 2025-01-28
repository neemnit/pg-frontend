import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavLink from "./components/NavLink";
import Register from "./components/Register";
import Login from "./components/Login";
import Building from "./components/Building";
import { useEffect, useState } from "react";
import Room from "./components/Room";
import Tenant from "./components/Tenant";

function App() {

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  useEffect(()=>{
    if(localStorage.getItem("authToken")){
      handleAuth()
      
    }
  },[])

  const handleAuth = () => {
    setUserLoggedIn(!userLoggedIn);
  };

  return (
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
          <Route path="addbuilding" element={<Building />} />
          <Route path="addroom" element={<Room/>}/>
          <Route path="addtenant" element={<Tenant/>}/>
          <Route path="login" element={<Login handleAuth={handleAuth} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
