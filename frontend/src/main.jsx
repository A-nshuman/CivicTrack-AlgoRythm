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
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Import main styles
import './styles/main.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

// The BrowserRouter should be the outermost component
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/my-issues" element={<MyIssues />} />
          
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
