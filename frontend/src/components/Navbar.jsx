import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import "../css/Navbar.css";

const Navbar = ({ isLoggedIn, user, handleLogout }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  // Watch for changes in localStorage for compareProducts
  useEffect(() => {
    const handleStorageChange = () => {
      const products = JSON.parse(localStorage.getItem('compareProducts') || '[]');
      setSelectedProducts(products);
    };

    handleStorageChange(); // Initial load

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const goToComparison = () => {
    navigate(`/compare?ids=${selectedProducts.join(',')}`);
  };

  return (
    <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">Quick Commerce</Link>
        </div>

        {/* <div className="navbar-search">
          <input type="text" placeholder="Search for products..." />
          <button>Search</button>
        </div> */}

        <div className="navbar-links">
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Home
              </Link>
              <Link to="/products" className="nav-link">
                Products
              </Link>
              <div className="nav-link cart-link">
                <Link to="/cart">
                  Cart
                </Link>
              </div>
              {/* --- Compare Button Start --- */}
              {selectedProducts.length > 0 && (
                <button
                  onClick={goToComparison}
                  className="compare-nav-button"
                  style={{ marginLeft: "10px" }}
                >
                  Compare ({selectedProducts.length}/2)
                </button>
              )}
              {/* --- Compare Button End --- */}
              <div className="user-menu">
                <button className="user-button">
                  {user?.name || "Account"}
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item">
                    My Orders
                  </Link>
                  {user?.isAdmin && (
                    <Link to="/admin" className="nav-link">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;