import { Card } from '@/components/ui/Card';
import { FileText, Brain, Target, Layers, ShieldCheck, Download } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Upload your documentation',
    description: 'Drag in a README.md, PDF, DOCX, or TXT. We parse and clean the content instantly.',
  },
  {
    icon: Brain,
    title: 'AI analyzes your startup',
    description: 'We extract problem, solution, market, business model, competition, USP, and funding ask into a structured analysis.',
  },
  {
    icon: Target,
    title: 'Choose your audience',
    description: 'Hackathon judge, angel investor, VC, or grant committee. The AI retunes story, order, and tone for each.',
  },
  {
    icon: Layers,
    title: 'Generate the pitch deck',
    description: 'A full 16-slide deck with presenter notes, elevator pitches, and 20 investor Q&As — built for your audience.',
  },
  {
    icon: ShieldCheck,
    title: 'Verify on Algorand',
    description: 'The deck hash is recorded on-chain with a verification ID. Anyone can confirm it was not modified.',
  },
  {
    icon: Download,
    title: 'Export & present',
    description: 'Download an editable PPTX or PDF, or present directly from the beautiful in-app slide preview.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-violet-400 tracking-wide uppercase">How it works</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">
            From README to <span className="text-gradient-soft">investor-ready</span> in six steps
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Card key={i} hover className="p-6 relative">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-surface-2 border border-violet-400/30 flex items-center justify-center text-xs font-bold text-violet-300">
                        {i + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink mb-1.5">{step.title}</h3>
                      <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
