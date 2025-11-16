import { useEffect, useState } from 'react';
import { Search, Plus, MapPin, Clock, X, Bell, LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { incidentService } from '../services/incidentService';
import { workerService } from '../services/workerService';
import { useNotification } from '../hooks/useNotification';
import { Incident, CreateIncidentData } from '../types/incident.types';
import { Worker } from '../types/worker.types';
import { CATEGORIES, PRIORITIES, STATUSES, ROLES } from '../utils/constants';

export default function IncidentsPage() {
  const { user, logout } = useAuth();
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const incidentFilters: any = { ...filters };
      if (user?.role === 'worker') {
        incidentFilters.assignedTo = user.userId;
      }
      
      // Cargar incidentes
      const incidentData = await incidentService.getIncidents(incidentFilters);
      setIncidents(incidentData);

      // Cargar trabajadores solo si es admin (sin bloquear la carga de incidentes)
      if (user?.role === 'admin') {
        try {
          const workerData = await workerService.getWorkers({ sortBy: 'workload', order: 'asc' });
          setWorkers(workerData);
        } catch (workerErr) {
          console.error('Error al cargar trabajadores:', workerErr);
          // No mostrar error al usuario, solo log
        }
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      addNotification('error', 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIncident = async (data: CreateIncidentData) => {
    try {
      await incidentService.createIncident(data);
      addNotification('success', 'Incidente creado exitosamente');
      setShowCreateModal(false);
      fetchData();
    } catch (err: any) {
      addNotification('error', err.response?.data?.message || 'Error al crear incidente');
    }
  };

  const handleUpdateIncident = async (id: string, status: string, comment: string) => {
    try {
      await incidentService.updateIncident(id, { status: status as any, comment });
      addNotification('success', 'Incidente actualizado');
      setSelectedIncident(null);
      fetchData();
    } catch (err) {
      addNotification('error', 'Error al actualizar incidente');
    }
  };

  const handleAssignWorker = async (incidentId: string, workerId: string) => {
    try {
      await incidentService.assignWorker(incidentId, workerId);
      addNotification('success', 'Trabajador asignado exitosamente');
      fetchData();
    } catch (err) {
      addNotification('error', 'Error al asignar trabajador');
    }
  };

  const filteredIncidents = incidents.filter((i) =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen  from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Gestión de Incidentes</h1>
              <p className="text-sm text-gray-600">{user?.name} - {ROLES[user?.role || 'alumno']}</p>
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar incidentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todos los estados</option>
                {Object.entries(STATUSES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todas las prioridades</option>
                {Object.entries(PRIORITIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              {user?.role === 'alumno' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
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
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                Cargando...
              </div>
            ) : filteredIncidents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
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

// Supporting Components
function IncidentCard({ incident, onClick }: any) {
  const statusColors: any = {
    pending: 'bg-gray-100 text-gray-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-600',
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
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">{incident.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{incident.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[incident.priority]}`}>
          {PRIORITIES[incident.priority as keyof typeof PRIORITIES]}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[incident.status]}`}>
          {STATUSES[incident.status as keyof typeof STATUSES]}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {CATEGORIES[incident.category as keyof typeof CATEGORIES]}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
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
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Resumen</h3>
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
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-700">{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${colors[color]}`}>
        {value}
      </span>
    </div>
  );
}

function WorkersPanel({ workers }: { workers: Worker[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Personal Disponible</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {workers.map((worker) => (
          <div key={worker.userId} className="bg-gray-50 rounded-lg p-3 border">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-800">{worker.name}</p>
                <p className="text-xs text-gray-600">{worker.specialty}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                worker.status === 'available' ? 'bg-green-100 text-green-800' :
                worker.status === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {worker.status === 'available' ? 'Disponible' : worker.status === 'moderate' ? 'Moderado' : 'Ocupado'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{worker.activeIncidents} activos</span>
              <span>{worker.workloadPoints}/20 pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreateIncidentModal({ onClose, onCreate }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'mantenimiento-general',
    priority: 'medium' as any,
    location: { building: '', floor: 1, room: '', specificLocation: '' },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onCreate(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
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
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Incidente'}
          </button>
        </form>
      </div>
    </div>
  );
}
function IncidentDetailModal({ incident, onClose, onUpdate, onAssign, workers, userRole, userId }: any) {
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState(incident.status);
  const [selectedWorker, setSelectedWorker] = useState('');

  const handleUpdate = () => {
    if (comment.trim()) {
      onUpdate(incident.incidentId, newStatus, comment);
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
          {/* Title and badges */}
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

          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Descripción</h4>
            <p className="text-gray-600">{incident.description}</p>
          </div>

          {/* Location */}
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

          {/* Reporter info */}
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

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-medium">Creado</p>
              <p className="text-gray-800">{new Date(incident.createdAt).toLocaleString('es-PE')}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Actualizado</p>
              <p className="text-gray-800">{new Date(incident.updatedAt).toLocaleString('es-PE')}</p>
            </div>
            {incident.resolvedAt && (
              <div>
                <p className="text-gray-600 font-medium">Resuelto</p>
                <p className="text-gray-800">{new Date(incident.resolvedAt).toLocaleString('es-PE')}</p>
              </div>
            )}
          </div>

          {/* Assign worker (admin only) */}
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

          {/* Update status */}
          {canUpdate && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-700 mb-3">Actualizar Incidente</h4>
              <div className="space-y-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(STATUSES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Agregar comentario sobre la actualización..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                />
                <button
                  onClick={handleUpdate}
                  disabled={!comment.trim()}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
                >
                  Actualizar Incidente
                </button>
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
    pending: { label: 'Pendiente', color: 'bg-gray-100 text-gray-800' },
    assigned: { label: 'Asignado', color: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'En Progreso', color: 'bg-yellow-100 text-yellow-800' },
    resolved: { label: 'Resuelto', color: 'bg-green-100 text-green-800' },
    closed: { label: 'Cerrado', color: 'bg-gray-100 text-gray-600' },
  };
  const s = config[status] || config.pending;
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: any = {
    low: { label: 'Baja', color: 'bg-blue-100 text-blue-800' },
    medium: { label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    high: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    urgent: { label: 'Urgente', color: 'bg-red-100 text-red-800' },
  };
  const p = config[priority] || config.medium;
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.color}`}>{p.label}</span>;
}