import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import type { Incident } from '../../types';

interface IncidentCardProps {
  incident: Incident;
  onClick: () => void;
  userRole: string;
}

export default function IncidentCard({ incident, onClick }: IncidentCardProps) {
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

  const statusLabels = {
    pending: 'Pendiente',
    assigned: 'Asignado',
    in_progress: 'En Progreso',
    resolved: 'Resuelto',
    closed: 'Cerrado',
  };

  const priorityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-4 border hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{incident.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{incident.description}</p>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[incident.priority]}`}
          >
            {priorityLabels[incident.priority]}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[incident.status]}`}
          >
            {statusLabels[incident.status]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span>
            {incident.location.building} - {incident.location.room}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{new Date(incident.createdAt).toLocaleDateString('es-PE')}</span>
        </div>
      </div>
    </div>
  );
}