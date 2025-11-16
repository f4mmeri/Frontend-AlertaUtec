
import React from 'react';
import { Users } from 'lucide-react';
import type { Worker } from '../../types';

interface WorkersCardProps {
  workers: Worker[];
}

export default function WorkersCard({ workers }: WorkersCardProps) {
  const statusColors = {
    available: 'bg-green-100 text-green-700',
    moderate: 'bg-yellow-100 text-yellow-700',
    busy: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    available: 'Disponible',
    moderate: 'Moderado',
    busy: 'Ocupado',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Personal de Mantenimiento</h3>
      </div>

      <div className="space-y-3">
        {workers.slice(0, 5).map((worker) => (
          <div key={worker.userId} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{worker.name}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[worker.status]}`}
              >
                {statusLabels[worker.status]}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-2">{worker.specialty}</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{worker.activeIncidents} incidentes activos</span>
              <span className="text-gray-600">{worker.workloadPoints}/20 pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}