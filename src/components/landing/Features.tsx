import {
  FileText,
  Sparkles,
  Target,
  ShieldCheck,
  Coins,
  Download,
  Brain,
  Mic,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: Brain,
    title: 'AI Startup Consultant',
    description:
      'Not just slides. PitchForge understands your project, evaluates it, and improves the narrative before generating anything.',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    icon: Target,
    title: 'Audience Optimizer',
    description:
      'The same deck retuned for hackathon judges, angel investors, VCs, and grant committees — different story, order, and tone.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: TrendingUp,
    title: 'Startup Health Analyzer',
    description:
      'Scores across innovation, market, business, scalability, and investment readiness — with actionable AI suggestions.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: ShieldCheck,
    title: 'Algorand Verification',
    description:
      'Every generated deck is hashed and recorded on Algorand. A public verification ID proves the deck was not modified.',
    gradient: 'from-rose-500 to-red-600',
  },
  {
    icon: Coins,
    title: 'x402 Payment Protocol',
    description:
      'Pitch generation is gated behind an x402 Payment Required flow. Pay, generate, download — clean and demo-ready.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Download,
    title: 'Editable PPTX & PDF Export',
    description:
      'Export a fully editable PowerPoint or PDF with one click. Every slide, note, and metric preserved.',
    gradient: 'from-fuchsia-500 to-purple-600',
  },
  {
    icon: FileText,
    title: 'Multi-format Ingestion',
    description:
      'Drop in a README.md, PDF, DOCX, or TXT. Drag-and-drop with a live progress indicator and intelligent parsing.',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    icon: Mic,
    title: 'Presenter Notes & Q&A',
    description:
      'Speaker notes for every slide, 20 likely investor questions with prepared answers, and 30s/60s/3min elevator pitches.',
    gradient: 'from-teal-500 to-cyan-600',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-violet-400 tracking-wide uppercase">Features</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">
            Everything a founder needs to <span className="text-gradient-soft">pitch like a pro</span>
          </h2>
          <p className="mt-4 text-ink-muted leading-relaxed">
            PitchForge AI is not a slide generator. It is a full pitch preparation suite — analysis,
            audience tuning, verification, and export.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} hover className="p-5 group">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{f.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
