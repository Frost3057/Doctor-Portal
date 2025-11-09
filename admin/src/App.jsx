// App.jsx - Simplified
import React, { useContext } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Pharmacy from './pages/Admin/Pharmacy';
import PharmacyOrders from './pages/Admin/PharmacyOrders';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorChatPage from './pages/Doctor/DoctorChatPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';

const AdminLayout = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  if (!aToken && !dToken) {
    return <Navigate to='/admin/login' replace />
  }

  return (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <div className='flex-1 min-h-screen bg-[#F8F9FD] px-4 py-6'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/admin/login' element={<Login />} />
  <Route path='/admin/*' element={<AdminLayout />}>
          <Route index element={<Navigate to='dashboard' replace />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='admin-dashboard' element={<Dashboard />} />
          <Route path='all-appointments' element={<AllAppointments />} />
          <Route path='add-doctor' element={<AddDoctor />} />
          <Route path='doctor-list' element={<DoctorsList />} />
          <Route path='pharmacy' element={<Pharmacy />} />
          <Route path='orders' element={<PharmacyOrders />} />
          <Route path='doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='doctor-appointments' element={<DoctorAppointments />} />
          <Route path='doctor-profile' element={<DoctorProfile />} />
          <Route path='doctor-chat' element={<DoctorChatPage />} />
          <Route path='*' element={<Navigate to='dashboard' replace />} />
        </Route>
        <Route path='*' element={<Navigate to='/admin' replace />} />
      </Routes>
    </>
  )
}

export default App;
