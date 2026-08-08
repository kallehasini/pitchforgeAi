import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export function Card({ children, className, hover, glass = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-violet-500/12 shadow-card',
        glass ? 'glass' : 'bg-surface',
        hover && 'transition-all duration-300 hover:border-violet-400/30 hover:shadow-glow hover:-translate-y-0.5',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5 pb-0', className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
