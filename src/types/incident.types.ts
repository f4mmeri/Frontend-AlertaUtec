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
  priority: IncidentPriority;
  status: IncidentStatus;
  location: Location;
  images?: string[];           // URLs de imágenes en S3
  imageUrl?: string;           // URL de imagen principal (retrocompatibilidad)
  reportedBy: string | ReportedBy;
  assignedTo?: string | AssignedTo;
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  comments?: Comment[];
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