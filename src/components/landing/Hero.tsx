import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  FileText,
  Sparkles,
  ShieldCheck,
  Coins,
  Layers,
  Target,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 h-72 w-[40rem] bg-violet-600/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute top-40 right-10 h-48 w-48 bg-fuchsia-500/15 rounded-full blur-[100px] animate-float-slow" />
      <div className="absolute top-60 left-10 h-40 w-40 bg-cyan-500/10 rounded-full blur-[90px] animate-float-slow" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-violet-300 mb-7 animate-fade-up">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 rounded-full bg-violet-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
            </span>
            AI + Algorand + x402 — built for the hackathon
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-up delay-100">
            One README.
            <br />
            <span className="text-gradient">The right pitch</span>
            <br />
            for every audience.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-ink-muted leading-relaxed max-w-2xl mx-auto animate-fade-up delay-200">
            PitchForge AI reads your technical documentation and turns it into a polished,
            investor-ready pitch deck — then retunes the story for hackathon judges, VCs,
            angels, or grant committees.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up delay-300">
            <Link to="/signup">
              <Button size="lg" className="group">
                Forge your pitch
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-dim animate-fade-up delay-400">
            {['No credit card', 'Algorand-verified', 'x402 protected'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-16 max-w-5xl mx-auto animate-fade-up delay-500">
          <FlowPreview />
        </div>
      </div>
    </section>
  );
}

function FlowPreview() {
  const steps = [
    { icon: FileText, label: 'Upload README', color: 'from-violet-500 to-purple-600' },
    { icon: Sparkles, label: 'AI Analyzes', color: 'from-fuchsia-500 to-pink-600' },
    { icon: Target, label: 'Pick Audience', color: 'from-cyan-500 to-blue-600' },
    { icon: Layers, label: 'Deck Generated', color: 'from-emerald-500 to-teal-600' },
    { icon: Coins, label: 'x402 Payment', color: 'from-amber-500 to-orange-600' },
    { icon: ShieldCheck, label: 'Algorand Verified', color: 'from-rose-500 to-red-600' },
  ];

  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-glow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-400/70" />
          <div className="h-3 w-3 rounded-full bg-amber-400/70" />
          <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
        </div>
        <span className="text-xs text-ink-dim font-mono">pitchforge.ai/generate</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="relative">
              <div className="glass rounded-xl p-4 flex flex-col items-center gap-2.5 text-center hover:border-violet-400/30 transition-all hover:-translate-y-1">
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-ink-muted">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-2.5 -translate-y-1/2 h-4 w-4 text-violet-500/40" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        {[
          { label: 'Startup Health Score', value: '88/100', icon: TrendingUp },
          { label: 'Audience Variants', value: '4 types', icon: Target },
          { label: 'Investor Q&A', value: '20 prepared', icon: ShieldCheck },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 border border-white/5">
              <Icon className="h-5 w-5 text-violet-400" />
              <div>
                <div className="text-sm font-semibold text-ink">{stat.value}</div>
                <div className="text-xs text-ink-dim">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
