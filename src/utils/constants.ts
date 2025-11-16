export const API_BASE_URL = 'https://gvi4wdtw7f.execute-api.us-east-1.amazonaws.com';
export const WS_URL = 'wss://3hvxj1td1d.execute-api.us-east-1.amazonaws.com/dev';

export const CATEGORIES = {
  'mantenimiento-general': 'Mantenimiento General',
  'seguridad': 'Seguridad',
  'infraestructura': 'Infraestructura',
  'limpieza': 'Limpieza',
  'electricidad': 'Electricidad',
  'plomeria': 'Plomería',
  'sistemas-tecnologia': 'Sistemas y Tecnología',
  'elevadores': 'Elevadores',
  'otros': 'Otros'
} as const;

export const PRIORITIES = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
} as const;

export const STATUSES = {
  pending: 'Pendiente',
  assigned: 'Asignado',
  in_progress: 'En Progreso',
  resolved: 'Resuelto',
  closed: 'Cerrado'
} as const;

export const ROLES = {
  alumno: 'Estudiante',
  worker: 'Trabajador',
  admin: 'Administrador'
} as const;