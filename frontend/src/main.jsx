import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Pages and Components
import App from './App.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import ReportIssue from './components/ReportIssue/ReportIssue.jsx';
import MyIssues from './components/MyIssues/MyIssues.jsx';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx'; // Import the new page
import Navbar from './components/Navbar/Navbar.jsx';
import AdminRoute from './components/AdminRoute.jsx'; // Import the protected route

// Import main styles
import './styles/main.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/my-issues" element={<MyIssues />} />
          
          {/* New Admin Route */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
