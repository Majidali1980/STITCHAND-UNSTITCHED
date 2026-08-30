import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slideUp ${
              isSuccess
                ? 'bg-white border-emerald-300 text-[#1c1917]'
                : isError
                ? 'bg-white border-red-300 text-[#1c1917]'
                : 'bg-[#1c1917] border-[#292524] text-white'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-600" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-[#ea580c]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold leading-none mb-1">{toast.title}</h5>
              <p className="text-[11px] text-[#57534e] dark:text-[#a1a1aa] leading-tight">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#a8a29e] hover:text-[#292524] p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
