import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colorConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-800',
      title: 'text-green-900',
      hover: 'hover:bg-green-100'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800',
      title: 'text-red-900',
      hover: 'hover:bg-red-100'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      text: 'text-amber-800',
      title: 'text-amber-900',
      hover: 'hover:bg-amber-100'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-800',
      title: 'text-blue-900',
      hover: 'hover:bg-blue-100'
    },
  };

  const config = colorConfig[toast.type] || colorConfig.info;
  const Icon = icons[toast.type] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: 300 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 300, transition: { duration: 0.2 } }}
      className={`${config.bg} ${config.border} border-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm flex items-center gap-3 min-w-[280px] sm:min-w-[300px] max-w-[90vw] sm:max-w-[400px]`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.icon}`} />
      <div className="flex-1">
        {toast.title && (
          <p className={`font-semibold text-sm ${config.title}`}>{toast.title}</p>
        )}
        <p className={`text-sm ${config.text}`}>{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ${config.hover} rounded p-1 transition-colors ${config.text}`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-2 sm:right-4 z-[9999] flex flex-col gap-2 pointer-events-none px-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

