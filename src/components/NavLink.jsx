import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const NavLink = ({ userLoggedIn, handleAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent immediate redirect when navigating manually
    if (localStorage.getItem("authToken") && window.location.pathname === '/') {
      navigate("/addbuilding");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    handleAuth(false); // Update authentication status
    navigate("/login");
    setIsMenuOpen(false); // Close the menu
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const navLinks = userLoggedIn
    ? [
        { to: "/addbuilding", label: "Add Building", icon: "🏢" },
        { to: "/addroom", label: "Add Room", icon: "🛏️" },
        { to: "/addtenant", label: "Add Tenant", icon: "👤" },
      ]
    : [
        { to: "/register", label: "Register", icon: "✍️" },
        { to: "/login", label: "Login", icon: "🔑" },
      ];

  return (
    <div>
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full h-16 z-50 shadow-lg bg-cyan-800 ">
        <ul className="list-none flex justify-between items-center h-full px-4">
          <li className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl md:text-3xl">🏠</span>
            <span className="text-base sm:text-lg md:text-2xl text-white whitespace-nowrap">
              Welcome to PG of Bangalore
            </span>
          </li>

          {/* Full Navigation for Large Screens */}
          <li className="items-center space-x-4 hidden lg:flex">
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center space-x-2 text-white hover:text-gray-300"
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
            {userLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-white hover:text-red-400"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            )}
          </li>

          {/* Hamburger Menu for Small and Medium Screens */}
          <li className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-white text-3xl hover:text-gray-400"
            >
              {isMenuOpen ? "✖️" : "☰"}
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-black text-white z-40">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)} // Close the menu on link click
                className="text-xl hover:text-gray-300"
              >
                <span>{icon}</span> {label}
              </Link>
            ))}
            {userLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-xl hover:text-red-400"
              >
                <span>🚪</span> Logout
              </button>
            )}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

// Define prop types
NavLink.propTypes = {
  userLoggedIn: PropTypes.bool.isRequired,
  handleAuth: PropTypes.func.isRequired,
};

export default NavLink;
