import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { Incident } from '../../types';
import IncidentCard from './IncidentCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface IncidentListProps {
  incidents: Incident[];
  loading: boolean;
  onIncidentClick: (incident: Incident) => void;
  userRole: string;
}

export default function IncidentList({
  incidents,
  loading,
  onIncidentClick,
  userRole,
}: IncidentListProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (incidents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center border">
        <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No se encontraron incidentes</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <IncidentCard
          key={incident.incidentId}
          incident={incident}
          onClick={() => onIncidentClick(incident)}
          userRole={userRole}
        />
      ))}
    </div>
  );
}