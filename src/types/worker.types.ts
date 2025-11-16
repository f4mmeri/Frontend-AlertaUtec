import type { IncidentPriority, IncidentStatus } from "./incident.types";

export interface CurrentIncident {
  incidentId: string;
  title: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  assignedAt: number;
}

export interface WorkerStats {
  totalResolved: number;
  avgResolutionTimeHours: number;
  rating: number;
}

export interface Worker {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  specialty: string;
  department?: string;
  activeIncidents: number;
  workloadPoints: number;
  maxWorkloadPoints: number;
  status: 'available' | 'moderate' | 'busy';
  currentIncidents?: CurrentIncident[];
  stats?: WorkerStats;
}