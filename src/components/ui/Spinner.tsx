import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const dims = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return (
    <span
      className={cn(
        'inline-block rounded-full border-2 border-violet-500/20 border-t-violet-400 animate-spin',
        dims[size],
        className,
      )}
    />
  );
}

export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Spinner size="lg" />
      {label && <p className="text-sm text-ink-muted">{label}</p>}
    </div>
  );
}
