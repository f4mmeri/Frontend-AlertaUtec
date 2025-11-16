// ============================================
// src/pages/DashboardPage.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, Zap, Bell, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { incidentService } from '../services/incidentService';
import { Incident } from '../types/incident.types';
import { ROLES } from '../utils/constants';

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
    <div className="min-h-screen  from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Sistema de Gestión de Incidentes</h1>
              <p className="text-sm text-gray-600">
                {user?.name} - {ROLES[user?.role || 'alumno']}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Pendientes" value={stats.pending} icon={Clock} color="yellow" />
          <StatsCard title="En Progreso" value={stats.inProgress} icon={AlertCircle} color="blue" />
          <StatsCard title="Resueltos" value={stats.resolved} icon={CheckCircle} color="green" />
          <StatsCard title="Urgentes" value={stats.urgent} icon={Zap} color="red" />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user?.role === 'alumno' && (
              <button
                onClick={() => navigate('/incidents')}
                className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
              >
                <Plus className="w-6 h-6 text-indigo-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Crear Incidente</p>
                  <p className="text-sm text-gray-600">Reportar nuevo problema</p>
                </div>
              </button>
            )}
            
            <button
              onClick={() => navigate('/incidents')}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              <AlertCircle className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">Ver Incidentes</p>
                <p className="text-sm text-gray-600">Lista completa</p>
              </div>
            </button>
            
            {user?.role === 'worker' && (
              <button
                onClick={() => navigate('/incidents?status=assigned')}
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
              >
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Mis Asignados</p>
                  <p className="text-sm text-gray-600">Trabajar en incidentes</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Incidentes Recientes</h2>
            <button
              onClick={() => navigate('/incidents')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
            >
              Ver todos →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando...</div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay incidentes</div>
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
  const colors: Record<'blue' | 'green' | 'yellow' | 'red', string> = {
    blue: 'bg-blue-500 text-blue-600',
    green: 'bg-green-500 text-green-600',
    yellow: 'bg-yellow-500 text-yellow-600',
    red: 'bg-red-500 text-red-600',
  };

  const [bgColor, textColor] = colors[color].split(' ');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} bg-opacity-10 rounded-lg`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function IncidentRow({ incident, onClick }: any) {
  const statusColors: any = {
    pending: 'bg-gray-100 text-gray-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
  };

  const priorityColors: any = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
    >
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{incident.title}</h4>
        <p className="text-sm text-gray-600">{incident.location.building} - {incident.location.room}</p>
      </div>
      <div className="flex gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[incident.priority]}`}>
          {incident.priority}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[incident.status]}`}>
          {incident.status}
        </span>
      </div>
    </div>
  );
}
