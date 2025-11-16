import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { Incident } from '../../types';

interface StatsCardProps {
  incidents: Incident[];
}

export default function StatsCard({ incidents }: StatsCardProps) {
  const stats = {
    pending: incidents.filter(i => i.status === 'pending').length,
    inProgress: incidents.filter(i => i.status === 'in_progress').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    urgent: incidents.filter(i => i.priority === 'urgent').length,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Estadísticas</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Pendientes</span>
          <span className="text-xl font-bold text-yellow-600">{stats.pending}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">En Progreso</span>
          <span className="text-xl font-bold text-blue-600">{stats.inProgress}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Resueltos</span>
          <span className="text-xl font-bold text-green-600">{stats.resolved}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Urgentes</span>
          <span className="text-xl font-bold text-red-600">{stats.urgent}</span>
        </div>
      </div>
    </div>
  );
}