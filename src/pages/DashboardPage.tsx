// ============================================
// src/pages/DashboardPage.tsx
// ============================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, Zap, Bell, LogOut, Plus, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { incidentService } from '../services/incidentService';
import { Incident } from '../types/incident.types';
import { ROLES } from '../utils/constants';
import UTECLogo from '../components/UTECLogo';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (user?.role === 'worker') {
        filters.assignedTo = user.userId;
      }
      const data = await incidentService.getIncidents(filters);
      setIncidents(data);
    } catch (err) {
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    pending: incidents.filter((i) => i.status === 'pending').length,
    inProgress: incidents.filter((i) => i.status === 'in_progress').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
    urgent: incidents.filter((i) => i.priority === 'urgent').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UTECLogo size="sm" className="shadow-lg" />
            <div>
              <h1 className="text-xl font-bold text-white">Sistema de Gestión de Incidentes</h1>
              <p className="text-sm text-blue-200">
                {user?.name} - {ROLES[user?.role || 'alumno']}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-white hover:text-blue-200 hover:bg-white/10 rounded-lg transition-colors"
              title="Ir al dashboard"
            >
              <Home className="w-5 h-5" />
            </button>
            <button className="relative p-2 text-white hover:text-blue-200 hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-white hover:text-blue-200 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Pendientes" value={stats.pending} icon={Clock} color="yellow" />
          <StatsCard title="En Progreso" value={stats.inProgress} icon={AlertCircle} color="blue" />
          <StatsCard title="Resueltos" value={stats.resolved} icon={CheckCircle} color="green" />
          <StatsCard title="Urgentes" value={stats.urgent} icon={Zap} color="red" />
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-6 border border-white/20 animate-slide-up">
          <h2 className="text-xl font-bold text-white mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user?.role === 'alumno' && (
              <button
                onClick={() => navigate('/incidents')}
                className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all transform hover:scale-105 border border-white/20"
              >
                <Plus className="w-6 h-6 text-white" />
                <div className="text-left">
                  <p className="font-semibold text-white">Crear Incidente</p>
                  <p className="text-sm text-blue-200">Reportar nuevo problema</p>
                </div>
              </button>
            )}
            
            <button
              onClick={() => navigate('/incidents')}
              className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all transform hover:scale-105 border border-white/20"
            >
              <AlertCircle className="w-6 h-6 text-white" />
              <div className="text-left">
                <p className="font-semibold text-white">Ver Incidentes</p>
                <p className="text-sm text-blue-200">Lista completa</p>
              </div>
            </button>
            
            {user?.role === 'worker' && (
              <button
                onClick={() => navigate('/incidents?status=assigned')}
                className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all transform hover:scale-105 border border-white/20"
              >
                <CheckCircle className="w-6 h-6 text-white" />
                <div className="text-left">
                  <p className="font-semibold text-white">Mis Asignados</p>
                  <p className="text-sm text-blue-200">Trabajar en incidentes</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 animate-slide-up-delay">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Incidentes Recientes</h2>
            <button
              onClick={() => navigate('/incidents')}
              className="text-white hover:text-blue-200 font-semibold text-sm transition-colors"
            >
              Ver todos →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-blue-200">Cargando...</div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-8 text-blue-200">No hay incidentes</div>
          ) : (
            <div className="space-y-3">
              {incidents.slice(0, 5).map((incident) => (
                <IncidentRow key={incident.incidentId} incident={incident} onClick={() => navigate('/incidents')} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  const colors: Record<'blue' | 'green' | 'yellow' | 'red', { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-400/30' },
    green: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-400/30' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-400/30' },
    red: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-400/30' },
  };

  const colorConfig = colors[color];

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border ${colorConfig.border} hover:bg-white/20 transition-all transform hover:scale-105 animate-slide-up`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colorConfig.bg} rounded-xl`}>
          <Icon className={`w-6 h-6 ${colorConfig.text}`} />
        </div>
      </div>
      <h3 className="text-blue-200 text-sm font-medium mb-1">{title}</h3>
      <p className={`text-3xl font-bold ${colorConfig.text}`}>{value}</p>
    </div>
  );
}

function IncidentRow({ incident, onClick }: any) {
  const statusColors: any = {
    pending: 'bg-gray-500/30 text-gray-200 border-gray-400/30',
    assigned: 'bg-blue-500/30 text-blue-200 border-blue-400/30',
    in_progress: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30',
    resolved: 'bg-green-500/30 text-green-200 border-green-400/30',
  };

  const priorityColors: any = {
    low: 'bg-blue-500/30 text-blue-200 border-blue-400/30',
    medium: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30',
    high: 'bg-orange-500/30 text-orange-200 border-orange-400/30',
    urgent: 'bg-red-500/30 text-red-200 border-red-400/30',
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/20 cursor-pointer transition-all transform hover:scale-[1.02]"
    >
      <div className="flex-1">
        <h4 className="font-semibold text-white">{incident.title}</h4>
        <p className="text-sm text-blue-200">{incident.location.building} - {incident.location.room}</p>
      </div>
      <div className="flex gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[incident.priority]}`}>
          {incident.priority}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[incident.status]}`}>
          {incident.status}
        </span>
      </div>
    </div>
  );
}
