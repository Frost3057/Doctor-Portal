import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaUserMd, 
  FaStethoscope,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaChartLine, 
  FaEye
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const { aToken, fetchDashboardData, dashDaata, BACKEND_URL } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);

  const Navigate=useNavigate();
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!aToken) {
        toast.error('Admin authentication required');
        return;
      }
      
      setLoading(true);
      await fetchDashboardData();
      setLoading(false);
    };

    loadDashboardData();
  }, [aToken]);

  // Format date for display
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if appointment is upcoming
  const isUpcoming = (dateString) => {
    const [day, month, year] = dateString.split('-');
    const appointmentDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="mb-6 sm:mb-8">
            <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-64"></div>
          </div>
          
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md border p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-8"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Latest appointments skeleton */}
          <div className="bg-white rounded-lg shadow-md border p-4">
            <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-3 border rounded">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back! Here's what's happening in your clinic today.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {/* Total Doctors */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 sm:p-3 rounded-full mr-3">
              <FaUserMd className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <p className="text-blue-600 font-semibold text-xs sm:text-sm">Total Doctors</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-800">
                {dashDaata?.doctors || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Total Patients */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 sm:p-3 rounded-full mr-3">
              <FaUser className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <p className="text-green-600 font-semibold text-xs sm:text-sm">Total Patients</p>
              <p className="text-xl sm:text-2xl font-bold text-green-800">
                {dashDaata?.users || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-purple-500 p-2 sm:p-3 rounded-full mr-3">
              <FaCalendarAlt className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <p className="text-purple-600 font-semibold text-xs sm:text-sm">Total Appointments</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-800">
                {dashDaata?.appointments || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Revenue (placeholder) */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-2 sm:p-3 rounded-full mr-3">
              <FaChartLine  className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <p className="text-yellow-600 font-semibold text-xs sm:text-sm">This Month</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-800">
                ₹{((dashDaata?.appointments || 0) * 50).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Latest Appointments */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-md border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Latest Appointments
                </h2>
                <button className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center">
                  <FaEye className="mr-1" />
                  View All
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              {dashDaata?.latestAppointments?.length > 0 ? (
                <div className="space-y-4">
                  {dashDaata.latestAppointments.map((appointment, index) => (
                    <div
                      key={appointment._id || index}
                      className={`flex flex-col sm:flex-row gap-4 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        appointment.cancelled 
                          ? 'bg-red-50 border-red-200' 
                          : appointment.isCompleted
                          ? 'bg-green-50 border-green-200'
                          : isUpcoming(appointment.slotDate)
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {/* Patient & Doctor Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={appointment.userData?.image || '/default-avatar.png'}
                          alt={appointment.userData?.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-800 text-sm truncate">
                            {appointment.userData?.name}
                          </h4>
                          <p className="text-xs text-gray-600 truncate">
                            with {appointment.docData?.name}
                          </p>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="mr-1 text-blue-500" />
                          <span>{formatDate(appointment.slotDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-1 text-green-500" />
                          <span>{appointment.slotTime}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaRupeeSign className="mr-1 text-yellow-500" />
                          <span>₹{appointment.amount}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        {appointment.cancelled ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <FaTimesCircle className="mr-1" />
                            Cancelled
                          </span>
                        ) : appointment.isCompleted ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FaCheckCircle className="mr-1" />
                            Completed
                          </span>
                        ) : appointment.payment ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <FaCheckCircle className="mr-1" />
                            Paid
                          </span>
                        ) : isUpcoming(appointment.slotDate) ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <FaClock className="mr-1" />
                            Upcoming
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <FaTimesCircle className="mr-1" />
                            Expired
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                  <p className="text-gray-500">No recent appointments</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md border p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={()=>Navigate('add-doctor')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                <FaUserMd className="inline mr-2" />
                Add New Doctor
              </button>
              <button onClick={()=>Navigate('all-appointments')} className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                <FaCalendarAlt className="inline mr-2" />
                View All Appointments
              </button>
              <button onClick={()=>Navigate('doctor-list')} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                <FaUser className="inline mr-2" />
                Manage Doctors
              </button>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-white rounded-lg shadow-md border p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Upcoming</span>
                <span className="font-semibold text-yellow-600">
                  {dashDaata?.latestAppointments?.filter(app => 
                    !app.cancelled && isUpcoming(app.slotDate) && !app.isCompleted
                  ).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">
                  {dashDaata?.latestAppointments?.filter(app => app.isCompleted).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="font-semibold text-red-600">
                  {dashDaata?.latestAppointments?.filter(app => app.cancelled).length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
