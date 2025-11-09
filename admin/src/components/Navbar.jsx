import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { FaSignOutAlt, FaUser, FaBell, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext);
    const { dToken, setDToken, profileData } = useContext(DoctorContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        if (aToken) {
            localStorage.removeItem('aToken');
            setAToken('');
            navigate('/admin/login');
        } else if (dToken) {
            localStorage.removeItem('dToken');
            setDToken('');
            navigate('/admin/login');
        }
        setShowDropdown(false);
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('appointments')) return 'Appointments';
        if (path.includes('profile')) return 'Profile';
        if (path.includes('add-doctor')) return 'Add Doctor';
        if (path.includes('doctor-list')) return 'Doctors List';
        return 'Dashboard';
    };

    return (
        <nav className="relative bg-white shadow-md px-4 py-3 flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
                <img src={assets.admin_logo} alt="Logo" className="h-10 w-auto" />
                <div className="hidden sm:block">
                    <h1 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
                {/* Role Badge */}
                <div className="flex items-center gap-2">
                    <span className="border px-3 py-1 border-gray-300 bg-blue-100 text-sm rounded-full font-medium text-gray-700">
                        {aToken ? 'Admin' : dToken ? 'Doctor' : 'Guest'}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${aToken ? 'bg-green-500' : dToken ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                </div>

                {/* Notifications (Optional) */}
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200">
                    <FaBell />
                </button>

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                        {dToken && profileData?.image ? (
                            <img
                                src={profileData.image}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <FaUser className="text-gray-600 text-sm" />
                            </div>
                        )}
                        <FaChevronDown className="text-xs text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="py-2">
                                {dToken && (
                                    <button
                                        onClick={() => {
                                            navigate('/admin/doctor-profile');
                                            setShowDropdown(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <FaUser /> Profile
                                    </button>
                                )}
                                <hr className="my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Logout Button */}
                <button
                    onClick={handleLogout}
                    className="sm:hidden bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-xs rounded-full shadow-sm flex items-center gap-1 transition-colors duration-200"
                >
                    <FaSignOutAlt className="text-xs" />
                    Logout
                </button>
            </div>

            {/* Click outside to close dropdown */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </nav>
    );
};

export default Navbar;
