import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import TaskBoard from './pages/TaskBoard';
import ProfileSettings from './pages/ProfileSettings';
import TeamManagement from './pages/TeamManagement';
import ActivityPage from './pages/ActivityPage';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-dark">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function AppContent() {
  const { user, logout } = useAuth();

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#fff',
          color: '#333',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          padding: '12px 24px',
        },
      }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute><AppLayout user={user} logout={logout} /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<TaskBoard />} />
          <Route path="/tasks" element={<TaskBoard />} />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/activity" element={<ActivityPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
