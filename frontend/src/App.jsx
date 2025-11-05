import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Contact from './pages/Contact';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Appointment from './pages/Appointment';
import MyOrders from './pages/MyOrders';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UserProvider from '../src/context/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserChatPage from './pages/UserChatPage';
import Pharmacy from './pages/Pharmacy';
import PrescriptionReaderPage from './pages/PrescriptionReader';
const App = () => {
  const location = useLocation();

  const hideLayoutOnPaths = ['/login'];

  const shouldHideLayout = hideLayoutOnPaths.includes(location.pathname);
  
  return (
    <UserProvider>
      <div className='mx-4 sm:mx-[10%]'>
        {!shouldHideLayout && <Navbar />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/chat' element={<UserChatPage />} />
          <Route path='/pharmacy' element={<Pharmacy />} />
          <Route path='/prescription-reader' element={<PrescriptionReaderPage />} />
          <Route path='/my-orders' element={<MyOrders />} />
        </Routes>
        {!shouldHideLayout && <Footer />}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </UserProvider>
  );
};

export default App;
