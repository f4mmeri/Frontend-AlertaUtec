// src/context/WebSocketContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { websocketService } from '../services/websocketService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification'; // ✅ Hook para mostrar notificaciones

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    // Solo conectar si hay un usuario autenticado
    const token = localStorage.getItem('token');
    if (!token || !user) {
      websocketService.disconnect();
      setIsConnected(false);
      return;
    }

    // Conectar WebSocket
    console.log('🔌 Conectando WebSocket...');
    websocketService.connect(token, handleMessage);
    setIsConnected(true);

    // Cleanup al desmontar o cerrar sesión
    return () => {
      console.log('🔌 Desconectando WebSocket...');
      websocketService.disconnect();
      setIsConnected(false);
    };
  }, [user]);

  const handleMessage = useCallback((data: any) => {
    console.log('📨 WebSocket mensaje recibido:', data);
    
    // Procesar notificaciones según el tipo de evento
    processNotification(data);
    
    // Actualizar el lastMessage para que los componentes puedan reaccionar
    setLastMessage({ ...data, timestamp: Date.now() });
  }, [user]);

  const processNotification = (data: any) => {
    if (!user) return;

    const eventType = data.type;
    const payload = data.data;

    switch (eventType) {
      case 'NEW_INCIDENT':
        // Notificación para nuevo incidente
        if (user.role === 'admin') {
          addNotification(
            'info',
            `🆕 Nuevo incidente: ${payload.title} (Prioridad: ${getPriorityLabel(payload.priority)})`
          );
        } else if (user.role === 'worker') {
          // Solo notificar a workers si el incidente es de su especialidad o sin asignar
          addNotification(
            'info',
            `🆕 Nuevo incidente reportado: ${payload.title}`
          );
        }
        break;

      case 'ASSIGN_INCIDENT':
        // Notificación cuando se asigna un incidente
        if (user.role === 'admin') {
          addNotification(
            'success',
            `✅ Incidente asignado: ${payload.title}`
          );
        } else if (user.role === 'worker' && payload.assignedTo?.userId === user.userId) {
          // Notificación especial para el worker asignado
          addNotification(
            'warning',
            `🔔 Te han asignado un nuevo incidente: ${payload.title} (${getPriorityLabel(payload.priority)})`
          );
        }
        break;

      case 'UPDATE_INCIDENT':
        // Notificación para actualizaciones
        if (user.role === 'admin') {
          addNotification(
            'info',
            `🔄 Incidente actualizado: ${payload.title} → ${getStatusLabel(payload.status)}`
          );
        } else if (user.role === 'worker' && payload.assignedTo?.userId === user.userId) {
          addNotification(
            'info',
            `🔄 Incidente actualizado: ${payload.title}`
          );
        } else if (user.role === 'alumno' && payload.reportedBy?.userId === user.userId) {
          // Notificar al alumno que reportó el incidente
          addNotification(
            'info',
            `🔄 Tu incidente fue actualizado: ${payload.title} → ${getStatusLabel(payload.status)}`
          );
        }
        break;

      case 'DELETE_INCIDENT':
        if (user.role === 'admin') {
          addNotification('info', '🗑️ Un incidente ha sido eliminado');
        }
        break;

      case 'UPDATE_WORKER':
        if (user.role === 'admin') {
          addNotification('info', `👤 Trabajador actualizado: ${payload.name}`);
        }
        break;

      default:
        console.log('⚠️ Tipo de mensaje desconocido:', eventType);
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket debe usarse dentro de WebSocketProvider');
  }
  return context;
}

// Funciones auxiliares para obtener labels legibles
function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente'
  };
  return labels[priority] || priority;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    assigned: 'Asignado',
    in_progress: 'En Progreso',
    resolved: 'Resuelto',
    closed: 'Cerrado'
  };
  return labels[status] || status;
}