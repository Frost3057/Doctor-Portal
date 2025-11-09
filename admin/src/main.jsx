import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AdminRoot from './AdminRoot.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminRoot>
      <App />
    </AdminRoot>
  </BrowserRouter>
)
