import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MapPin, Clock, X, Bell, LogOut, AlertCircle, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../context/WebSocketContext';
import { incidentService } from '../services/incidentService';
import { workerService } from '../services/workerService';
import { useNotification } from '../hooks/useNotification';
import { Incident, CreateIncidentData } from '../types/incident.types';
import { Worker} from '../types/worker.types';
import { CATEGORIES, PRIORITIES, STATUSES, ROLES } from '../utils/constants';
import UTECLogo from '../components/UTECLogo';

import { Upload, X as XIcon } from 'lucide-react'; // Asegúrate de importar Upload

export default function IncidentsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { lastMessage } = useWebSocket();
  const { addNotification } = useNotification();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    fetchData();
  }, [filters]);

  // Escuchar cambios en lastMessage del WebSocket
  useEffect(() => {
    if (!lastMessage) return;

    console.log('🔔 Procesando mensaje WebSocket:', lastMessage);
    
    const eventType = lastMessage.type;
    const payload = lastMessage.data;

    switch (eventType) {
      case 'NEW_INCIDENT':
        console.log('✨ Nuevo incidente detectado:', payload);
        setIncidents((prev) => [payload, ...prev]);
        break;

      case 'UPDATE_INCIDENT':
        console.log('🔄 Actualización de incidente:', payload);
        setIncidents((prev) =>
          prev.map((inc) =>
            inc.incidentId === payload.incidentId ? payload : inc
          )
        );
        if (selectedIncident?.incidentId === payload.incidentId) {
          setSelectedIncident(payload);
        }
        break;

      case 'ASSIGN_INCIDENT':
        console.log('👷 Asignación de incidente:', payload);
        setIncidents((prev) =>
          prev.map((inc) =>
            inc.incidentId === payload.incidentId ? payload : inc
          )
        );
        if (selectedIncident?.incidentId === payload.incidentId) {
          setSelectedIncident(payload);
        }
        if (user?.role === 'admin') {
          fetchWorkers();
        }
        break;

      case 'DELETE_INCIDENT':
        console.log('🗑️ Eliminación de incidente');
        const deletedId = payload.incidentId || lastMessage.incidentId;
        setIncidents((prev) => prev.filter((inc) => inc.incidentId !== deletedId));
        if (selectedIncident?.incidentId === deletedId) {
          setSelectedIncident(null);
        }
        break;

      case 'UPDATE_WORKER':
        if (user?.role === 'admin') {
          console.log('👤 Actualización de trabajador');
          setWorkers((prev) =>
            prev.map((w) => (w.userId === payload.userId ? payload : w))
          );
        }
        break;

      default:
        console.log('⚠️ Tipo de mensaje desconocido:', eventType);
    }
  }, [lastMessage, selectedIncident, user?.role]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const incidentFilters: any = { ...filters };
      if (user?.role === 'worker') {
        incidentFilters.assignedTo = user.userId;
      }
      
      const incidentData = await incidentService.getIncidents(incidentFilters);
      setIncidents(incidentData);

      if (user?.role === 'admin') {
        await fetchWorkers();
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      addNotification('error', 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const workersData = await workerService.getWorkers({ sortBy: 'workload', order: 'asc' });
      console.log('👥 Workers recibidos:', workersData);
      setWorkers(Array.isArray(workersData) ? workersData : []);
    } catch (workerErr) {
      console.error('Error al cargar trabajadores:', workerErr);
      setWorkers([]);
    }
  };

  const handleCreateIncident = async (data: CreateIncidentData) => {
    try {
      await incidentService.createIncident(data);
      addNotification('success', 'Incidente creado exitosamente');
      setShowCreateModal(false);
      // No necesitamos fetchData() aquí porque WebSocket lo actualizará automáticamente
    } catch (err: any) {
      addNotification('error', err.response?.data?.message || 'Error al crear incidente');
    }
  };

  const handleUpdateIncident = async (id: string, status: string, comment: string) => {
    try {
      await incidentService.updateIncident(id, { status: status as any, comment });
      addNotification('success', 'Incidente actualizado');
      setSelectedIncident(null);
      
    } catch (err) {
      addNotification('error', 'Error al actualizar incidente');
    }
  };

  const handleAssignWorker = async (incidentId: string, workerId: string) => {
    try {
      console.log('🔧 Intentando asignar:', { incidentId, workerId });
      
      await incidentService.assignWorker(incidentId, workerId);
      
      addNotification('success', 'Trabajador asignado exitosamente');
      
      // ✅ CERRAR EL MODAL
      setSelectedIncident(null);
      
      // ✅ REFRESCAR DATOS INMEDIATAMENTE (por si WebSocket tarda)
      await fetchData();
      
    } catch (err: any) {
      console.error('❌ Error completo:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Error al asignar trabajador';
      addNotification('error', errorMessage);
    }
  };

  const filteredIncidents = incidents.filter((i) =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-xl font-bold text-white">Gestión de Incidentes</h1>
              <p className="text-sm text-blue-200">{user?.name} - {ROLES[user?.role || 'alumno']}</p>
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
        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 mb-6 border border-white/20 animate-slide-up">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200" />
                <input
                  type="text"
                  placeholder="Buscar incidentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              >
                <option value="" className="bg-blue-900 text-white">Todos los estados</option>
                {Object.entries(STATUSES).map(([key, label]) => (
                  <option key={key} value={key} className="bg-blue-900 text-white">{label}</option>
                ))}
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              >
                <option value="" className="bg-blue-900 text-white">Todas las prioridades</option>
                {Object.entries(PRIORITIES).map(([key, label]) => (
                  <option key={key} value={key} className="bg-blue-900 text-white">{label}</option>
                ))}
              </select>

              {user?.role === 'alumno' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Incidente
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incidents List */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center text-blue-200 border border-white/20">
                Cargando...
              </div>
            ) : filteredIncidents.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center text-blue-200 border border-white/20">
                No hay incidentes que mostrar
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <IncidentCard
                  key={incident.incidentId}
                  incident={incident}
                  onClick={() => setSelectedIncident(incident)}
                />
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <StatsPanel incidents={incidents} />
            {user?.role === 'admin' && workers.length > 0 && (
              <WorkersPanel workers={workers} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateIncidentModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateIncident}
        />
      )}

      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdate={handleUpdateIncident}
          onAssign={handleAssignWorker}
          workers={workers}
          userRole={user?.role || 'alumno'}
          userId={user?.userId || ''}
        />
      )}
    </div>
  );
}

function IncidentCard({ incident, onClick }: any) {
  const statusColors: any = {
    pending: 'bg-gray-500/30 text-gray-200 border-gray-400/30',
    assigned: 'bg-blue-500/30 text-blue-200 border-blue-400/30',
    in_progress: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30',
    resolved: 'bg-green-500/30 text-green-200 border-green-400/30',
    closed: 'bg-gray-500/30 text-gray-300 border-gray-400/30',
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
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 hover:bg-white/20 transition-all transform hover:scale-[1.02] cursor-pointer border border-white/20"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg">{incident.title}</h3>
          <p className="text-sm text-blue-200 mt-1 line-clamp-2">{incident.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[incident.priority]}`}>
          {PRIORITIES[incident.priority as keyof typeof PRIORITIES]}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[incident.status]}`}>
          {STATUSES[incident.status as keyof typeof STATUSES]}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/30 text-purple-200 border border-purple-400/30">
          {CATEGORIES[incident.category as keyof typeof CATEGORIES]}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-blue-200">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{incident.location.building} - {incident.location.room}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

function StatsPanel({ incidents }: { incidents: Incident[] }) {
  const stats = {
    pending: incidents.filter((i) => i.status === 'pending').length,
    inProgress: incidents.filter((i) => i.status === 'in_progress').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
    urgent: incidents.filter((i) => i.priority === 'urgent').length,
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/20 animate-slide-up-delay">
      <h3 className="font-semibold text-white mb-3">Resumen</h3>
      <div className="space-y-2">
        <StatItem label="Pendientes" value={stats.pending} color="yellow" />
        <StatItem label="En Progreso" value={stats.inProgress} color="blue" />
        <StatItem label="Resueltos" value={stats.resolved} color="green" />
        <StatItem label="Urgentes" value={stats.urgent} color="red" />
      </div>
    </div>
  );
}

function StatItem({ label, value, color }: any) {
  const colors: any = {
    yellow: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30',
    blue: 'bg-blue-500/30 text-blue-200 border-blue-400/30',
    green: 'bg-green-500/30 text-green-200 border-green-400/30',
    red: 'bg-red-500/30 text-red-200 border-red-400/30',
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-blue-200">{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${colors[color]}`}>
        {value}
      </span>
    </div>
  );
}

function WorkersPanel({ workers }: { workers: Worker[] }) {
  if (!workers || workers.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/20 animate-slide-up-delay-2">
        <h3 className="font-semibold text-white mb-3">Personal Disponible</h3>
        <div className="text-center py-8 text-blue-200">
          <p className="text-sm">No hay trabajadores disponibles</p>
        </div>
      </div>
    );
  }

  // Ordenar por disponibilidad: available > moderate > busy
  const sortedWorkers = [...workers].sort((a, b) => {
    const statusOrder = { available: 0, moderate: 1, busy: 2 };
    const orderA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
    const orderB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
    if (orderA !== orderB) return orderA - orderB;
    return a.workloadPoints - b.workloadPoints;
  });

  const availableCount = workers.filter(w => w.status === 'available').length;
  const moderateCount = workers.filter(w => w.status === 'moderate').length;
  const busyCount = workers.filter(w => w.status === 'busy').length;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/20 animate-slide-up-delay-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Personal Disponible</h3>
        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium border border-white/30">
          {workers.length} total
        </span>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-green-500/20 rounded-lg p-2 text-center border border-green-400/30">
          <p className="text-2xl font-bold text-green-200">{availableCount}</p>
          <p className="text-xs text-green-200">Disponibles</p>
        </div>
        <div className="bg-yellow-500/20 rounded-lg p-2 text-center border border-yellow-400/30">
          <p className="text-2xl font-bold text-yellow-200">{moderateCount}</p>
          <p className="text-xs text-yellow-200">Moderados</p>
        </div>
        <div className="bg-red-500/20 rounded-lg p-2 text-center border border-red-400/30">
          <p className="text-2xl font-bold text-red-200">{busyCount}</p>
          <p className="text-xs text-red-200">Ocupados</p>
        </div>
      </div>

      {/* Lista de trabajadores */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {sortedWorkers.map((worker) => (
          <WorkerCard key={worker.userId} worker={worker} />
        ))}
      </div>
    </div>
  );
}

function WorkerCard({ worker }: { worker: Worker }) {
  const statusConfig: any = {
    available: {
      label: 'Disponible',
      color: 'bg-green-500/30 text-green-200 border-green-400/30',
      icon: '✓',
      bgCard: 'bg-green-500/10'
    },
    moderate: {
      label: 'Moderado',
      color: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30',
      icon: '⚡',
      bgCard: 'bg-yellow-500/10'
    },
    busy: {
      label: 'Ocupado',
      color: 'bg-red-500/30 text-red-200 border-red-400/30',
      icon: '⚠',
      bgCard: 'bg-red-500/10'
    }
  };

  const config = statusConfig[worker.status] || statusConfig.available;
  const maxWorkload = worker.maxWorkloadPoints || 20;
  const workloadPercentage = Math.min((worker.workloadPoints / maxWorkload) * 100, 100);
  const rating = worker.stats?.rating || 0;
  const totalResolved = worker.stats?.totalResolved || 0;
  const avgResolutionTime = worker.stats?.avgResolutionTimeHours || 0;

  return (
    <div className={`rounded-xl p-3 border ${config.color.split(' ')[2]} bg-white/5 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm`}>
      {/* Header con nombre y estado */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white text-sm">{worker.name}</p>
            {rating > 0 && (
              <span className="text-xs text-yellow-200">
                ⭐ {rating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-xs text-blue-200 mt-0.5">{worker.specialty || 'General'}</p>
          {worker.email && (
            <p className="text-xs text-blue-300 truncate">{worker.email}</p>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color} flex items-center gap-1`}>
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </span>
      </div>

      {/* Barra de carga de trabajo */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-blue-200 font-medium">Carga de trabajo</span>
          <span className="text-xs font-semibold text-white">
            {worker.workloadPoints}/{maxWorkload} pts
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              workloadPercentage < 50 ? 'bg-green-400' :
              workloadPercentage < 75 ? 'bg-yellow-400' :
              'bg-red-400'
            }`}
            style={{ width: `${workloadPercentage}%` }}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="text-blue-200">
            <span className="font-semibold text-white">{worker.activeIncidents || 0}</span> activos
          </span>
          {totalResolved > 0 && (
            <span className="text-blue-200">
              <span className="font-semibold text-green-200">{totalResolved}</span> resueltos
            </span>
          )}
        </div>
        {avgResolutionTime > 0 && (
          <span className="text-blue-300 text-xs">
            ~{avgResolutionTime.toFixed(1)}h
          </span>
        )}
      </div>

      {/* Incidentes actuales (si tiene) */}
      {worker.currentIncidents && worker.currentIncidents.length > 0 && (
        <div className="mt-2 pt-2 border-t border-white/20">
          <p className="text-xs font-medium text-white mb-1">Trabajando en:</p>
          <div className="space-y-1">
            {worker.currentIncidents.slice(0, 2).map((inc: any) => (
              <div key={inc.incidentId} className="text-xs bg-white/10 rounded-lg p-1.5 border border-white/20 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate flex-1 text-blue-200">{inc.title}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${
                    inc.priority === 'urgent' ? 'bg-red-500/30 text-red-200 border-red-400/30' :
                    inc.priority === 'high' ? 'bg-orange-500/30 text-orange-200 border-orange-400/30' :
                    inc.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30' :
                    'bg-blue-500/30 text-blue-200 border-blue-400/30'
                  }`}>
                    {inc.priority === 'urgent' ? '🔥' : 
                     inc.priority === 'high' ? '⚡' :
                     inc.priority === 'medium' ? '📌' : '📋'}
                  </span>
                </div>
              </div>
            ))}
            {worker.currentIncidents.length > 2 && (
              <p className="text-xs text-blue-300 text-center">
                +{worker.currentIncidents.length - 2} más
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateIncidentModal({ onClose, onCreate }: any) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'mantenimiento-general',
    priority: 'medium' as any,
    location: { building: '', floor: 1, room: '', specificLocation: '' },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      setImageFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear FormData para enviar archivo
      const submitData: any = { ...formData };
      
      if (imageFile) {
        // Convertir imagen a base64 para enviar al backend
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Image = reader.result as string;
          submitData.image = base64Image;
          submitData.imageName = imageFile.name;
          submitData.imageType = imageFile.type;
          
          await onCreate(submitData);
          setLoading(false);
        };
        reader.readAsDataURL(imageFile);
      } else {
        await onCreate(submitData);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al crear incidente:', error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">Nuevo Incidente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              placeholder="Ej: Luz fundida en Aula 302"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              placeholder="Describe el problema en detalle..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 h-32"
              required
            />
          </div>

          {/* Sección de carga de imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen (opcional)
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click para subir una imagen
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG hasta 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                  title="Eliminar imagen"
                >
                  <XIcon className="w-5 h-5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
                  {imageFile?.name}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(PRIORITIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Ubicación</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Edificio/Pabellón *"
                value={formData.location.building}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, building: e.target.value },
                  })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />

              <input
                type="number"
                placeholder="Piso *"
                value={formData.location.floor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, floor: parseInt(e.target.value) },
                  })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />

              <input
                type="text"
                placeholder="Sala/Aula *"
                value={formData.location.room}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, room: e.target.value },
                  })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />

              <input
                type="text"
                placeholder="Ubicación específica"
                value={formData.location.specificLocation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, specificLocation: e.target.value },
                  })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Incidente'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}



// REEMPLAZA la función IncidentDetailModal completa en IncidentsPage.tsx

function IncidentDetailModal({ incident, onClose, onUpdate, onAssign, workers, userRole, userId }: any) {
  const [comment, setComment] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('');

  // Mapa de transiciones de estados permitidas
  const statusTransitions: Record<string, string> = {
    'pending': 'assigned',      // Pendiente → Asignado
    'assigned': 'in_progress',  // Asignado → En Progreso
    'in_progress': 'resolved',  // En Progreso → Resuelto
    'resolved': 'closed',       // Resuelto → Cerrado
    'closed': 'closed'          // Cerrado → Cerrado (sin cambios)
  };

  // Obtener el siguiente estado permitido
  const nextStatus = statusTransitions[incident.status] || incident.status;
  const canTransition = nextStatus !== incident.status;

  const handleUpdate = () => {
    if (comment.trim() && canTransition) {
      onUpdate(incident.incidentId, nextStatus, comment);
      setComment('');
    }
  };

  const handleAssign = () => {
    if (selectedWorker) {
      onAssign(incident.incidentId, selectedWorker);
      setSelectedWorker('');
    }
  };

  const canUpdate =
    userRole === 'admin' ||
    (userRole === 'worker' &&
      incident.assignedTo &&
      (typeof incident.assignedTo === 'string'
        ? incident.assignedTo === userId
        : incident.assignedTo.userId === userId));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Detalle del Incidente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{incident.title}</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={incident.status} />
              <PriorityBadge priority={incident.priority} />
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {CATEGORIES[incident.category as keyof typeof CATEGORIES]}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Descripción</h4>
            <p className="text-gray-600">{incident.description}</p>
          </div>

          {/* Mostrar imagen si existe - soporta ambos formatos */}
          {(incident.imageUrl || (incident.images && incident.images.length > 0)) && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                {incident.images && incident.images.length > 1 ? 'Imágenes' : 'Imagen'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Si hay array de imágenes */}
                {incident.images && incident.images.length > 0 ? (
                  incident.images.map((imageUrl: string, index: number) => (
                    <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imageUrl}
                        alt={`${incident.title} - Imagen ${index + 1}`}
                        className="w-full h-64 object-cover bg-gray-50 cursor-pointer hover:opacity-90 transition"
                        onClick={() => window.open(imageUrl, '_blank')}
                        title="Click para ver en tamaño completo"
                      />
                    </div>
                  ))
                ) : incident.imageUrl ? (
                  /* Si solo hay imageUrl (retrocompatibilidad) */
                  <div className="rounded-lg overflow-hidden border border-gray-200 md:col-span-2">
                    <img
                      src={incident.imageUrl}
                      alt={incident.title}
                      className="w-full max-h-96 object-contain bg-gray-50 cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(incident.imageUrl, '_blank')}
                      title="Click para ver en tamaño completo"
                    />
                  </div>
                ) : null}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Click en las imágenes para verlas en tamaño completo
              </p>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ubicación
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-1">
              <p className="text-gray-700">
                <strong>Edificio:</strong> {incident.location.building}
              </p>
              <p className="text-gray-700">
                <strong>Piso:</strong> {incident.location.floor}
              </p>
              <p className="text-gray-700">
                <strong>Sala:</strong> {incident.location.room}
              </p>
              {incident.location.specificLocation && (
                <p className="text-gray-700">
                  <strong>Detalles:</strong> {incident.location.specificLocation}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Reportado por</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                {typeof incident.reportedBy === 'string' ? (
                  <p className="text-gray-700">{incident.reportedBy}</p>
                ) : (
                  <>
                    <p className="text-gray-700 font-medium">{incident.reportedBy.name}</p>
                    <p className="text-sm text-gray-600">{incident.reportedBy.email}</p>
                  </>
                )}
              </div>
            </div>

            {incident.assignedTo && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Asignado a</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  {typeof incident.assignedTo === 'string' ? (
                    <p className="text-gray-700">{incident.assignedTo}</p>
                  ) : (
                    <>
                      <p className="text-gray-700 font-medium">{incident.assignedTo.name}</p>
                      <p className="text-sm text-gray-600">Trabajador</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {userRole === 'admin' && !incident.assignedTo && workers.length > 0 && (
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h4 className="font-semibold text-gray-700 mb-3">Asignar Trabajador</h4>
              <div className="flex gap-3">
                <select
                  value={selectedWorker}
                  onChange={(e) => setSelectedWorker(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Seleccionar trabajador...</option>
                  {workers
                    .filter((w: Worker) => w.status !== 'busy')
                    .map((w: Worker) => (
                      <option key={w.userId} value={w.userId}>
                        {w.name} - {w.specialty} ({w.activeIncidents} activos)
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedWorker}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Asignar
                </button>
              </div>
            </div>
          )}

          {canUpdate && canTransition && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-700 mb-3">Actualizar Incidente</h4>
              
              {/* Mostrar flujo de estados */}
              <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-2 font-medium">Progresión del estado:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={incident.status} />
                  <span className="text-gray-400">→</span>
                  <StatusBadge status={nextStatus} />
                </div>
              </div>

              <div className="space-y-3">
                {/* Campo de solo lectura mostrando el siguiente estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cambiar estado a:
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                    {STATUSES[nextStatus as keyof typeof STATUSES]}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Los incidentes solo pueden avanzar al siguiente estado en la secuencia
                  </p>
                </div>

                <textarea
                  placeholder="Agregar comentario sobre la actualización... (requerido)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                  required
                />
                
                <button
                  onClick={handleUpdate}
                  disabled={!comment.trim()}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Avanzar a: {STATUSES[nextStatus as keyof typeof STATUSES]}
                </button>
              </div>
            </div>
          )}

          {canUpdate && !canTransition && incident.status === 'closed' && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">Incidente cerrado</p>
                  <p className="text-sm">Este incidente ha completado su ciclo y no puede ser actualizado.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: any = {
    pending: { label: 'Pendiente', color: 'bg-gray-500/30 text-gray-200 border-gray-400/30' },
    assigned: { label: 'Asignado', color: 'bg-blue-500/30 text-blue-200 border-blue-400/30' },
    in_progress: { label: 'En Progreso', color: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30' },
    resolved: { label: 'Resuelto', color: 'bg-green-500/30 text-green-200 border-green-400/30' },
    closed: { label: 'Cerrado', color: 'bg-gray-500/30 text-gray-300 border-gray-400/30' },
  };
  const s = config[status] || config.pending;
  return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${s.color}`}>{s.label}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: any = {
    low: { label: 'Baja', color: 'bg-blue-500/30 text-blue-200 border-blue-400/30' },
    medium: { label: 'Media', color: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30' },
    high: { label: 'Alta', color: 'bg-orange-500/30 text-orange-200 border-orange-400/30' },
    urgent: { label: 'Urgente', color: 'bg-red-500/30 text-red-200 border-red-400/30' },
  };
  const p = config[priority] || config.medium;
  return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${p.color}`}>{p.label}</span>;
}