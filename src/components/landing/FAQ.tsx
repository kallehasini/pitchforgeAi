import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'What file formats can PitchForge AI read?',
    a: 'README.md, PDF, DOCX, and TXT. Just drag and drop your file and we parse it into clean text before analysis. Markdown is preferred since the AI can read structure directly.',
  },
  {
    q: 'How does the Audience Optimizer actually work?',
    a: 'Instead of regenerating text, the AI restructures the entire deck: slide order, technical depth, business focus, tone, and even the language used. A VC deck leads with market and revenue; a hackathon deck leads with innovation and architecture.',
  },
  {
    q: 'What is the Algorand verification for?',
    a: 'After generation, a hash of your deck is recorded on the Algorand blockchain with a unique verification ID. Anyone can later confirm the deck has not been modified — useful for investors, judges, and grant committees who want proof of authenticity.',
  },
  {
    q: 'What is x402 and why is payment required?',
    a: 'x402 is the HTTP Payment Required protocol. Pitch generation is gated behind a 402 response — you complete a mock payment, then the deck is generated and unlocked for download. It demonstrates the protocol end-to-end.',
  },
  {
    q: 'Can I edit the generated deck?',
    a: 'Yes. You can export to PPTX (fully editable in PowerPoint or Google Slides) or PDF. You can also present directly from the in-app preview, which renders every slide beautifully.',
  },
  {
    q: 'What does the Startup Health Analyzer measure?',
    a: 'Six dimensions: innovation, market, business model, scalability, presentation, and investment readiness. Each is scored 0–100 with an overall composite, plus AI-generated suggestions for improvement.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-violet-400 tracking-wide uppercase">FAQ</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">
            Questions, <span className="text-gradient-soft">answered</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Card key={i} className="overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-medium text-ink">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-violet-400 shrink-0 transition-transform duration-300',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-300',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-ink-muted leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
