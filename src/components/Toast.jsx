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

  const colors = {
    success: 'bg-gradient-to-r from-green-600 to-emerald-600',
    error: 'bg-gradient-to-r from-red-600 to-rose-600',
    warning: 'bg-gradient-to-r from-[#C8945C] to-[#B8844C]',
    info: 'bg-gradient-to-r from-[#2D4A3E] to-[#3D5A4E]',
  };

  const Icon = icons[toast.type] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: 300 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 300, transition: { duration: 0.2 } }}
      className={`${colors[toast.type] || colors.info} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl border-2 border-white/20 backdrop-blur-sm flex items-center gap-3 min-w-[280px] sm:min-w-[300px] max-w-[90vw] sm:max-w-[400px]`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1">
        {toast.title && (
          <p className="font-semibold text-sm">{toast.title}</p>
        )}
        <p className="text-sm">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
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

