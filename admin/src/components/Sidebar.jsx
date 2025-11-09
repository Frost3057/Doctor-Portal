import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink, useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { 
  FaTimes,
  FaSignOutAlt, 
  FaCommentDots,
  FaHome,
  FaCalendarAlt,
  FaUserPlus,
  FaUserMd,
  FaPills,
  FaShoppingCart,
  FaUser,
  FaTachometerAlt
} from 'react-icons/fa'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()
  
  const handleLogout = () => {
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
      navigate('/admin/login')
    } else if (dToken) {
      setDToken('')
      localStorage.removeItem('dToken')
      navigate('/admin/login')
    }
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={`
        fixed md:relative
        top-0 left-0
        h-full md:h-screen
        w-64 md:w-auto
        bg-white
        border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        z-50 md:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        min-h-screen
        flex flex-col
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <h2 className="text-lg font-semibold text-gray-800">
            {aToken ? 'Admin Panel' : 'Doctor Panel'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          {aToken && (
            <ul className="text-gray-600 mt-5 space-y-1">
              <li>
                <NavLink 
                  to='dashboard' 
                  onClick={handleLinkClick} 
                  className={({isActive}) => `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <FaTachometerAlt className="w-5 h-5" />
                  <p className="font-medium">Dashboard</p>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to='all-appointments' 
                  onClick={handleLinkClick} 
                  className={({isActive}) => `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <FaCalendarAlt className="w-5 h-5" />
                  <p className="font-medium">Appointments</p>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to='add-doctor' 
                  onClick={handleLinkClick} 
                  className={({isActive}) => `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <FaUserPlus className="w-5 h-5" />
                  <p className="font-medium">Add Doctor</p>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to='doctor-list' 
                  onClick={handleLinkClick} 
                  className={({isActive}) => `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <FaUserMd className="w-5 h-5" />
                  <p className="font-medium">Doctors List</p>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to='pharmacy' 
                  onClick={handleLinkClick} 
                  className={({isActive}) => `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <FaPills className="w-5 h-5" />
                  <p className="font-medium">Pharmacy</p>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to='orders' 
                  onClick={handleLinkClick} 
                  className={({isActive}) => `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <FaShoppingCart className="w-5 h-5" />
                  <p className="font-medium">Orders</p>
                </NavLink>
              </li>
            </ul>
          )}

          {dToken && (
            <ul className="text-gray-600 mt-5 space-y-1">
              <li>
                <NavLink 
                  to='doctor-dashboard' 
                  onClick={handleLinkClick} 
                  className={({isActive}) => `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <FaHome className="w-5 h-5" />
                  <p className="font-medium">Dashboard</p>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to='doctor-appointments' 
                  onClick={handleLinkClick} 
                  className={({isActive}) => `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <FaCalendarAlt className="w-5 h-5" />
                  <p className="font-medium">Appointments</p>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to='doctor-chat' 
                  onClick={handleLinkClick}
                  className={({isActive}) => `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <FaCommentDots className="w-5 h-5" />
                  <p className="font-medium">Messages</p>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to='doctor-profile' 
                  onClick={handleLinkClick} 
                  className={({isActive}) => `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <FaUser className="w-5 h-5" />
                  <p className="font-medium">Profile</p>
                </NavLink>
              </li>
            </ul>
          )}
        </div>
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <p>Logout</p>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar;
