import React, { useState } from 'react';
import { X, MapPin, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import type { Incident, Worker } from '../../types';

interface IncidentDetailProps {
  incident: Incident;
  onClose: () => void;
  onUpdate: () => void;
  userRole: string;
  workers: Worker[];
  showNotification: (type: 'success' | 'error', message: string) => void;
}

export default function IncidentDetail({
  incident,
  onClose,
  onUpdate,
  userRole,
  workers,
  showNotification,
}: IncidentDetailProps) {
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState<Incident['status']>(incident.status);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    if (newStatus === incident.status && !comment) {
      showNotification('error', 'No hay cambios para actualizar');
      return;
    }

    setLoading(true);
    try {
      await api.updateIncident(incident.incidentId, {
        status: newStatus,
        comment: comment || undefined,
      });
      showNotification('success', 'Incidente actualizado exitosamente');
      onUpdate();
      onClose();
    } catch (error: any) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignWorker = async () => {
    if (!selectedWorker) {
      showNotification('error', 'Selecciona un trabajador');
      return;
    }

    setLoading(true);
    try {
      await api.assignIncident(incident.incidentId, selectedWorker);
      showNotification('success', 'Trabajador asignado exitosamente');
      onUpdate();
      onClose();
    } catch (error: any) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-700',
    assigned: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-500',
  };

  const priorityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  };

  const statusLabels = {
    pending: 'Pendiente',
    assigned: 'Asignado',
    in_progress: 'En Progreso',
    resolved: 'Resuelto',
    closed: 'Cerrado',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Detalle del Incidente</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{incident.title}</h3>
                <p className="text-gray-600">{incident.description}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    priorityColors[incident.priority]
                  }`}
                >
                  {priorityLabels[incident.priority]}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[incident.status]
                  }`}
                >
                  {statusLabels[incident.status]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm text-gray-600">Categoría:</span>
                <p className="font-medium text-gray-900 capitalize">{incident.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">ID:</span>
                <p className="font-mono text-sm text-gray-900">{incident.incidentId}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Reportado por:</span>
                <p className="font-medium text-gray-900">
                  {typeof incident.reportedBy === 'object'
                    ? incident.reportedBy.name
                    : incident.reportedBy}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Fecha de reporte:</span>
                <p className="font-medium text-gray-900">
                  {new Date(incident.createdAt).toLocaleString('es-PE')}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={20} />
              Ubicación
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">Edificio:</span>
                <p className="font-medium text-gray-900">{incident.location.building}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Piso:</span>
                <p className="font-medium text-gray-900">{incident.location.floor}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Sala:</span>
                <p className="font-medium text-gray-900">{incident.location.room}</p>
              </div>
              {incident.location.specificLocation && (
                <div className="md:col-span-4">
                  <span className="text-sm text-gray-600">Detalles:</span>
                  <p className="font-medium text-gray-900">
                    {incident.location.specificLocation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          {incident.images && incident.images.length > 0 && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Imágenes</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {incident.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Incidente ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Assignment Info */}
          {incident.assignedTo && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Asignación</h4>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-gray-900">
                  {typeof incident.assignedTo === 'object'
                    ? incident.assignedTo.name
                    : incident.assignedTo}
                </p>
              </div>
            </div>
          )}

          {/* Comments */}
          {incident.comments && incident.comments.length > 0 && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Comentarios</h4>
              <div className="space-y-3">
                {incident.comments.map((c: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{c.userName}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(c.timestamp).toLocaleString('es-PE')}
                      </span>
                    </div>
                    <p className="text-gray-700">{c.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {(userRole === 'admin' || userRole === 'worker') && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Acciones</h4>

              {/* Assign Worker (Admin only) */}
              {userRole === 'admin' && incident.status === 'pending' && (
                <div className="mb-4 p-4 border rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignar Trabajador
                  </label>
                  <div className="flex gap-3">
                    <select
                      value={selectedWorker}
                      onChange={(e) => setSelectedWorker(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar trabajador...</option>
                      {workers.map((worker: Worker) => (
                        <option key={worker.userId} value={worker.userId}>
                          {worker.name} - {worker.specialty} ({worker.status})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignWorker}
                      disabled={loading || !selectedWorker}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Asignar
                    </button>
                  </div>
                </div>
              )}

              {/* Update Status */}
              <div className="p-4 border rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actualizar Estado
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Incident['status'])}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
                >
                  <option value="pending">Pendiente</option>
                  <option value="assigned">Asignado</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="resolved">Resuelto</option>
                  <option value="closed">Cerrado</option>
                </select>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agregar Comentario
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe un comentario sobre la actualización..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
                />

                <button
                  onClick={handleUpdateStatus}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                  {loading ? 'Actualizando...' : 'Actualizar Incidente'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}