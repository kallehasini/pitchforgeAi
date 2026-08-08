import { Link } from 'react-router-dom';
import { Sparkles, GitBranch, Link2, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-violet-500/10 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                PitchForge<span className="text-violet-400"> AI</span>
              </span>
            </div>
            <p className="text-sm text-ink-muted max-w-sm leading-relaxed">
              One README. The right pitch for every audience. Turn your technical documentation into
              investor-ready pitch decks with AI, Algorand verification, and x402 payments.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[GitBranch, Link2, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg glass flex items-center justify-center text-ink-muted hover:text-ink hover:border-violet-400/30 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink mb-3.5">Product</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li><Link to="/upload" className="hover:text-ink transition-colors">Generate Pitch</Link></li>
              <li><Link to="/verify" className="hover:text-ink transition-colors">Verify Deck</Link></li>
              <li><Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link></li>
              <li><a href="#pricing" className="hover:text-ink transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink mb-3.5">Technology</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li>Algorand Blockchain</li>
              <li>x402 Payment Protocol</li>
              <li>AI Analysis Engine</li>
              <li>PptxGenJS Export</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-violet-500/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-dim">
            © {new Date().getFullYear()} PitchForge AI. Built for the hackathon.
          </p>
          <div className="flex items-center gap-4 text-xs text-ink-dim">
            <a href="#" className="hover:text-ink-muted transition-colors">Privacy</a>
            <a href="#" className="hover:text-ink-muted transition-colors">Terms</a>
            <a href="#" className="hover:text-ink-muted transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
