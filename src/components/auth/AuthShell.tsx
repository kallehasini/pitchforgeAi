import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Coins, Layers } from 'lucide-react';

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-surface border-r border-violet-500/10">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-20 -left-10 h-72 w-72 bg-violet-600/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-20 right-0 h-60 w-60 bg-fuchsia-500/15 rounded-full blur-[100px] animate-float-slow" />

        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl">
            PitchForge<span className="text-violet-400"> AI</span>
          </span>
        </Link>

        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight max-w-md">
            Turn your README into a pitch deck that <span className="text-gradient">closes the round</span>.
          </h2>
          <div className="mt-8 space-y-4 max-w-sm">
            {[
              { icon: Layers, text: 'AI analyzes your project and extracts the business narrative' },
              { icon: ShieldCheck, text: 'Every deck is verified on the Algorand blockchain' },
              { icon: Coins, text: 'x402 payment protocol gates premium generation' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg glass flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-violet-300" />
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed pt-1.5">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative text-xs text-ink-dim">© {new Date().getFullYear()} PitchForge AI</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </Link>
        </div>
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold mb-1.5">{title}</h1>
          <p className="text-sm text-ink-muted mb-7">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
