import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  const config: any = {
    success: { icon: CheckCircle, className: 'bg-green-50 border-green-200 text-green-800' },
    error: { icon: AlertCircle, className: 'bg-red-50 border-red-200 text-red-800' },
    info: { icon: Info, className: 'bg-blue-50 border-blue-200 text-blue-800' },
    warning: { icon: AlertTriangle, className: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => {
        const { icon: Icon, className } = config[notification.type];
        return (
          <div
            key={notification.id}
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${className} animate-slide-in`}
          >
            <Icon className="w-5 h-5 " />
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className=" hover:opacity-70 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}