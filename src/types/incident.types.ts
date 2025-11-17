// incident.types.ts - Versión actualizada con soporte de imágenes

export interface Location {
  building: string;
  floor: number;
  room: string;
  specificLocation?: string;
}

export interface Comment {
  userId: string;
  userName: string;
  comment: string;
  timestamp: number;
}

export interface ReportedBy {
  userId: string;
  name: string;
  email: string;
  studentCode?: string;
}

export interface AssignedTo {
  userId: string;
  name: string;
  role: string;
}

export type IncidentPriority = 'low' | 'medium' | 'high' | 'urgent';
export type IncidentStatus = 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

export interface Incident {
  incidentId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location: {
    building: string;
    floor: number;
    room: string;
    specificLocation?: string;
  };
  reportedBy: {
    userId: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    userId: string;
    name: string;
  } | null;
  createdAt: number;
  imageUrl?: string; // Retrocompatibilidad
  images?: string[]; // Formato antiguo
  imageUrls?: string[]; // ✅ Formato actual del backend
}
export interface CreateIncidentData {
  title: string;
  description: string;
  category: string;
  priority: IncidentPriority;
  location: Location;
  images?: string[];           // URLs si ya existen
  image?: string;              // Imagen en base64 para subir
  imageName?: string;          // Nombre del archivo
  imageType?: string;          // Tipo MIME (image/jpeg, image/png, etc)
}

export interface UpdateIncidentData {
  status: IncidentStatus;
  comment: string;
}