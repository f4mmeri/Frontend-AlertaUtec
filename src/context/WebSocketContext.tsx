// src/context/WebSocketContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { websocketService } from '../services/websocketService';
import { useAuth } from '../hooks/useAuth';

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
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
    setLastMessage({ ...data, timestamp: Date.now() }); // Agregamos timestamp para forzar actualización
  }, []);

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