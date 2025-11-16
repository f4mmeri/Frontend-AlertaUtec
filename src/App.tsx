// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { NotificationProvider } from './context/NotificationContext';
import { WebSocketProvider } from './context/WebSocketContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IncidentsPage from './pages/IncidentsPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/NotificationContainer';

// Componente para manejar la ruta raíz: redirigir autenticados a dashboard
// Este componente debe estar dentro del AuthProvider
function HomeRoute() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <LandingPage />;
}

// Componente interno que usa los providers
function AppRoutes() {
  return (
    <BrowserRouter>
      <NotificationContainer />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <IncidentsPage />
            </ProtectedRoute>
          }
        />
        
        {/* Wildcard → también a landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <WebSocketProvider>
          <AppRoutes />
        </WebSocketProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;