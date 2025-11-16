// ⚠️ CAMBIA ESTA URL POR LA DE TU API
export const API_BASE_URL = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/dev';

export const CATEGORIES = [
  { value: 'electricidad', label: 'Electricidad' },
  { value: 'plomeria', label: 'Plomería' },
  { value: 'limpieza', label: 'Limpieza' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'infraestructura', label: 'Infraestructura' },
  { value: 'sistemas-tecnologia', label: 'Sistemas y Tecnología' },
  { value: 'otros', label: 'Otros' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-700' },
];

export const STATUSES = [
  { value: 'pending', label: 'Pendiente', color: 'bg-gray-100 text-gray-700' },
  { value: 'assigned', label: 'Asignado', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_progress', label: 'En Progreso', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'resolved', label: 'Resuelto', color: 'bg-green-100 text-green-700' },
  { value: 'closed', label: 'Cerrado', color: 'bg-gray-100 text-gray-500' },
];