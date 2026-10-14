import React from 'react';
import { useProject } from '../context/ProjectContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useProject();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[#1F1F1F] text-[#FAF8F5] shadow-xl border border-white/10 text-sm transition-all animate-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#8B9B88] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#C47B5A] shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#E2DDD3] shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />}
            <span className="truncate">{toast.message}</span>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-white/60 hover:text-white shrink-0 p-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
