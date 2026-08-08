import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  className?: string;
}

const variants = {
  default: 'bg-white/5 text-ink-muted border-white/10',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  error: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  info: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  accent: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
