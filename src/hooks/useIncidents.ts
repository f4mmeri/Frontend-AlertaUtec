import { useState, useEffect } from 'react';
import { Incident } from '../types/incident.types';
import { incidentService } from '../services/incidentService';

export function useIncidents(filters?: any) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidentService.getIncidents(filters);
      setIncidents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [JSON.stringify(filters)]);

  return { incidents, loading, error, refetch: fetchIncidents };
}