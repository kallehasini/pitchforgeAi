import { Card } from '@/components/ui/Card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Aisha Patel',
    role: 'Founder, NebulaDB',
    quote:
      'PitchForge took our 2,000-line README and produced a deck that actually got us a seed round. The audience optimizer is genius — our VC deck felt nothing like our hackathon deck.',
    avatar: 'AP',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    name: 'Marcus Chen',
    role: 'Hackathon Winner, ETHGlobal',
    quote:
      'We won. The judges specifically mentioned how clearly the deck communicated our architecture. The Algorand verification was a huge credibility boost.',
    avatar: 'MC',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'Sofia Ramirez',
    role: 'Grant Lead, OpenEarth',
    quote:
      'The government audience variant changed everything. It led with impact and sustainability instead of revenue — exactly what the committee wanted to see.',
    avatar: 'SR',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'James Okafor',
    role: 'Angel Investor',
    quote:
      'I see hundreds of decks a year. The ones from PitchForge are noticeably tighter — the health score and prepared Q&A show the founder actually understands their business.',
    avatar: 'JO',
    gradient: 'from-amber-500 to-orange-600',
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-violet-400 tracking-wide uppercase">Loved by builders</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">
            Founders are <span className="text-gradient-soft">winning with PitchForge</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6 relative overflow-hidden">
              <Quote className="absolute top-5 right-5 h-10 w-10 text-violet-500/10" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-ink-muted leading-relaxed mb-5 relative z-10">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-semibold text-white`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{t.name}</div>
                  <div className="text-xs text-ink-dim">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
