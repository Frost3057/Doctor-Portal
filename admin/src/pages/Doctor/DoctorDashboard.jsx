import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaChartLine, 
  FaEye,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaUsers
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const DoctorDashboard = () => {
  const { doctorDashboard, dToken } = useContext(DoctorContext)
  
  if (!doctorDashboard) {
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
    )
  }

  // Add safe destructuring with default values
  const { 
    appointments = 0, 
    earnings = 0, 
    latestAppointments = [] 
  } = doctorDashboard || {}

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAppointmentDate = (dateString) => {
    if (!dateString) return 'N/A'
    const [day, month, year] = dateString.split('-')
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const isUpcoming = (dateString) => {
    if (!dateString) return false
    const [day, month, year] = dateString.split('-')
    const appointmentDate = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return appointmentDate >= today
  }

  const getStatusBadge = (appointment) => {
    if (appointment.cancelled) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FaTimesCircle className="mr-1" />
          Cancelled
        </span>
      )
    } else if (appointment.isCompleted) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaCheckCircle className="mr-1" />
          Completed
        </span>
      )
    } else if (isUpcoming(appointment.slotDate)) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FaClock className="mr-1" />
          Upcoming
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FaHourglassHalf className="mr-1" />
          Pending
        </span>
      )
    }
  }

  const getPaymentBadge = (payment) => {
    return payment ? (
      <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-xl text-xs font-semibold">
        <FaCheckCircle className="mr-1" />
        Paid
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
        <FaTimesCircle className="mr-1" />
        Unpaid
      </span>
    )
  }
  const Navigate=useNavigate()
  // Calculate stats with safe checks
  const completedAppointments = latestAppointments.filter(app => app?.isCompleted).length
  const cancelledAppointments = latestAppointments.filter(app => app?.cancelled).length
  const upcomingAppointments = latestAppointments.filter(app => 
    !app?.cancelled && isUpcoming(app?.slotDate) && !app?.isCompleted
  ).length
  const totalPatients = new Set(latestAppointments.map(app => app?.userId).filter(Boolean)).size

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Dashboard Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Doctor Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back! Here's your practice overview and recent appointments.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {/* Total Appointments */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 sm:p-3 rounded-full mr-3">
              <FaCalendarAlt className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <p className="text-blue-600 font-semibold text-xs sm:text-sm">Total Appointments</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-800">
                {appointments || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 sm:p-3 rounded-full mr-3">
              <FaMoneyBillWave className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <p className="text-green-600 font-semibold text-xs sm:text-sm">Total Earnings</p>
              <p className="text-xl sm:text-2xl font-bold text-green-800">
                ₹{(earnings || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Total Patients */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-purple-500 p-2 sm:p-3 rounded-full mr-3">
              <FaUsers className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <p className="text-purple-600 font-semibold text-xs sm:text-sm">Total Patients</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-800">
                {totalPatients}
              </p>
            </div>
          </div>
        </div>

        {/* Completed Rate */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-2 sm:p-3 rounded-full mr-3">
              <FaChartLine className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <p className="text-yellow-600 font-semibold text-xs sm:text-sm">Success Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-800">
                {appointments > 0 ? Math.round((completedAppointments / appointments) * 100) : 0}%
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
              {latestAppointments.length > 0 ? (
                <div className="space-y-4">
                  {latestAppointments.map((appointment, index) => (
                    <div
                      key={appointment?._id || index}
                      className={`flex flex-col sm:flex-row gap-4 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        appointment?.cancelled 
                          ? 'bg-red-50 border-red-200' 
                          : appointment?.isCompleted
                          ? 'bg-green-50 border-green-200'
                          : isUpcoming(appointment?.slotDate)
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {/* Patient Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={appointment?.userData?.image || '/default-avatar.png'}
                          alt={appointment?.userData?.name || 'Patient'}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.src = '/default-avatar.png'
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-800 text-sm truncate">
                            {appointment?.userData?.name || 'Unknown Patient'}
                          </h4>
                          <p className="text-xs text-gray-600 truncate">
                            {appointment?.userData?.email || 'No email'}
                          </p>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="mr-1 text-blue-500" />
                          <span>{formatAppointmentDate(appointment?.slotDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-1 text-green-500" />
                          <span>{appointment?.slotTime || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaRupeeSign className="mr-1 text-yellow-500" />
                          <span>₹{appointment?.amount || 0}</span>
                        </div>
                      </div>

                      {/* Status & Payment */}
                      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                        {getStatusBadge(appointment)}
                        {getPaymentBadge(appointment?.payment)}
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

        {/* Quick Stats & Summary */}
        <div className="space-y-6">
          {/* Today's Summary */}
          <div className="bg-white rounded-lg shadow-md border p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600 flex items-center">
                  <FaClock className="mr-2 text-blue-500" />
                  Upcoming
                </span>
                <span className="font-semibold text-blue-600">
                  {upcomingAppointments}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600 flex items-center">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  Completed
                </span>
                <span className="font-semibold text-green-600">
                  {completedAppointments}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600 flex items-center">
                  <FaTimesCircle className="mr-2 text-red-500" />
                  Cancelled
                </span>
                <span className="font-semibold text-red-600">
                  {cancelledAppointments}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600 flex items-center">
                  <FaUsers className="mr-2 text-purple-500" />
                  Total Patients
                </span>
                <span className="font-semibold text-purple-600">
                  {totalPatients}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md border p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={()=>Navigate('/admin/doctor-appointments')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                <FaCalendarAlt className="inline mr-2" />
                View All Appointments
              </button>
              
              <button onClick={()=>Navigate('/admin/doctor-profile')} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                <FaUser className="inline mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Earnings Overview */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Earnings Overview</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-800 mb-2">
                ₹{(earnings || 0).toLocaleString()}
              </div>
              <p className="text-sm text-green-600 mb-4">Total Earnings</p>
              <div className="text-sm text-green-700">
                Average per appointment: ₹{appointments > 0 ? Math.round((earnings || 0) / appointments) : 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
