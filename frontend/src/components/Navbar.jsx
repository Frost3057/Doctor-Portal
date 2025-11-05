import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const NavItem = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
  >
    {label}
  </NavLink>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const image=localStorage.getItem('userImage') || assets.upload_area;

  const handleLogout = () => {
    setToken(false);
    navigate("/login");
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 text-sm py-4 mb-5 border-b border-b-gray-300 bg-white">
    
      <img
        className="w-40 cursor-pointer"
        src={assets.logo}
        alt="logo"
        onClick={() => navigate("/")}
      />

      <ul className="hidden md:flex items-center gap-6 font-medium">
        <NavItem to="/" label="HOME" />
        <NavItem to="/doctors" label="ALL DOCTORS" />
        <NavItem to="/about" label="ABOUT" />
        <NavItem to="/contact" label="CONTACT" />
        <NavItem to="/pharmacy" label="PHARMACY" />
        <NavItem to="/prescription-reader" label="PRESCRIPTION READER" />
      </ul>

      <div className="hidden md:flex items-center gap-4">
        {token ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                className="w-8 h-8 rounded-full"
                src={image}
                alt="Profile"
              />
              <img className="w-3" src={assets.dropdown_icon} alt="Dropdown" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg text-sm font-medium z-20">
                <p
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate("/my-profile");
                    setDropdownOpen(false);
                  }}
                >
                  My Profile
                </p>
                <p
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate("/my-appointments");
                    setDropdownOpen(false);
                  }}
                >
                  My Appointments
                </p>
                <p
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate("/my-orders");
                    setDropdownOpen(false);
                  }}
                >
                  My Orders
                </p>
                <p
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>

<div className="md:hidden">
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="p-2 rounded-md text-blue-600 hover:bg-blue-100 focus:outline-none"
    aria-label="Toggle Menu"
  >
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  {menuOpen && (
    <div
      ref={dropdownRef}
      className="absolute top-20 right-4 bg-white w-56 rounded-xl shadow-xl z-30"
    >
      <NavItem to="/" label="HOME" onClick={() => setMenuOpen(false)} />
      <NavItem to="/doctors" label="ALL DOCTORS" onClick={() => setMenuOpen(false)} />
      <NavItem to="/about" label="ABOUT" onClick={() => setMenuOpen(false)} />
      <NavItem to="/contact" label="CONTACT" onClick={() => setMenuOpen(false)} />
      <NavItem to="/pharmacy" label="PHARMACY" onClick={() => setMenuOpen(false)} />
      <NavItem to="/prescription-reader" label="PRESCRIPTION READER" onClick={() => setMenuOpen(false)} />

      {token ? (
        <>
          <NavItem to="/my-profile" label="My Profile" onClick={() => setMenuOpen(false)} />
          <NavItem to="/my-appointments" label="My Appointments" onClick={() => setMenuOpen(false)} />
          <NavItem to="/my-orders" label="My Orders" onClick={() => setMenuOpen(false)} />
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setMenuOpen(false);
            navigate("/login");
          }}
          className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50"
        >
          Login / Create Account
        </button>
      )}
    </div>
  )}
</div>

    </div>
  );
};

export default Navbar;
