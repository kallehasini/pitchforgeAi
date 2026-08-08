import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose?: () => void;
}

const icons: Record<ToastType, ReactNode> = {
  success: <span className="block h-2 w-2 rounded-full bg-emerald-400" />,
  error: <span className="block h-2 w-2 rounded-full bg-rose-400" />,
  info: <span className="block h-2 w-2 rounded-full bg-cyan-400" />,
};

export function Toast({ type, message }: ToastProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 glass-strong rounded-xl px-4 py-3 shadow-lg animate-slide-in-right',
        'max-w-sm',
      )}
    >
      {icons[type]}
      <p className="text-sm text-ink">{message}</p>
    </div>
  );
}

interface ToastContainerProps {
  toasts: { id: string; type: ToastType; message: string }[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <Toast key={t.id} type={t.type} message={t.message} />
      ))}
    </div>
  );
}
