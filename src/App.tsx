import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import type { User, Incident, Worker } from './types';

// Components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Header from './components/common/Header';
import Notification from './components/common/Notification';
import FilterBar from './components/dashboard/FilterBar';
import StatsCard from './components/dashboard/StatsCard';
import WorkersCard from './components/dashboard/WorkersCard';
import IncidentList from './components/incidents/IncidentList';
import CreateIncidentModal from './components/incidents/CreateIncidentModal';
import IncidentDetail from './components/incidents/IncidentDetail';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setView('dashboard');
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadIncidents();
      if (user.role === 'admin') {
        loadWorkers();
      }
    }
  }, [user, filters]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.category) params.category = filters.category;

      const response = await api.listIncidents(params);
      let incidentsList = response.data.incidents || [];

      if (filters.search) {
        incidentsList = incidentsList.filter(
          (inc: Incident) =>
            inc.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            inc.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setIncidents(incidentsList);
    } catch (error: any) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkers = async () => {
    try {
      const response = await api.listWorkers({ sortBy: 'workload', order: 'asc' });
      setWorkers(response.data.workers || []);
    } catch (error: any) {
      console.error('Error loading workers:', error);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setView('dashboard');
      showNotification('success', 'Inicio de sesión exitoso');
    } catch (error: any) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
    setIncidents([]);
    setWorkers([]);
  };

  if (view === 'login') {
    return (
      <LoginForm
        onLogin={handleLogin}
        onRegister={() => setView('register')}
        loading={loading}
      />
    );
  }

  if (view === 'register') {
    return (
      <RegisterForm
        onBack={() => setView('login')}
        onSuccess={() => setView('login')}
        showNotification={showNotification}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && <Notification type={notification.type} message={notification.message} />}

      {/* Header */}
      <Header user={user} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <FilterBar filters={filters} onFilterChange={setFilters} />

            {/* Create Incident Button */}
            {user?.role === 'alumno' && (
              <CreateIncidentModal
                onSuccess={loadIncidents}
                showNotification={showNotification}
              />
            )}

            {/* Incidents List */}
            <IncidentList
              incidents={incidents}
              loading={loading}
              onIncidentClick={setSelectedIncident}
              userRole={user?.role || 'alumno'}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <StatsCard incidents={incidents} />

            {/* Workers List (Admin only) */}
            {user?.role === 'admin' && workers.length > 0 && (
              <WorkersCard workers={workers} />
            )}
          </div>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetail
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdate={loadIncidents}
          userRole={user?.role || 'alumno'}
          workers={workers}
          showNotification={showNotification}
        />
      )}
    </div>
  );
}