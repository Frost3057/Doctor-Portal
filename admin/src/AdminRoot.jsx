import React from 'react';
import AdminContextProvider from './context/AdminContext.jsx';
import DoctorContextProvider from './context/DoctorContext.jsx';
import AppContextProvider from './context/AppContext.jsx';

const AdminRoot = ({ children }) => (
  <AdminContextProvider>
    <DoctorContextProvider>
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </DoctorContextProvider>
  </AdminContextProvider>
);

export default AdminRoot;
