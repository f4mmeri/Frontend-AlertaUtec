export interface User {
  userId: string;
  email: string;
  name: string;
  role: 'alumno' | 'worker' | 'admin';
  studentCode?: string;
  faculty?: string;
  career?: string;
}

export interface Incident {
  incidentId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  location: {
    building: string;
    floor: number;
    room: string;
    specificLocation?: string;
  };
  images?: string[];
  reportedBy: string | { userId: string; name: string; email: string };
  assignedTo?: string | { userId: string; name: string };
  createdAt: number;
  updatedAt: number;
  comments?: Array<{
    userId: string;
    userName: string;
    comment: string;
    timestamp: number;
  }>;
}

export interface Worker {
  userId: string;
  name: string;
  email: string;
  specialty: string;
  activeIncidents: number;
  workloadPoints: number;
  maxWorkloadPoints: number;
  status: 'available' | 'moderate' | 'busy';
}