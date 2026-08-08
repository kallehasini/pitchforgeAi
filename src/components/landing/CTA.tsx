import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTA() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative glass-strong rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow opacity-60" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-96 bg-violet-600/20 rounded-full blur-[100px]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-400/20 px-4 py-1.5 text-xs font-medium text-violet-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Free during the hackathon
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Your README already has
              <br />
              <span className="text-gradient">the perfect pitch inside it.</span>
            </h2>

            <p className="mt-5 text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
              Let PitchForge AI extract it, tune it for your audience, verify it on Algorand,
              and hand you a deck you can present in minutes.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup">
                <Button size="lg" className="group">
                  Start free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
