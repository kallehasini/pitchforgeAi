import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';
import { exportPptx, exportNotesPdf } from '@/lib/pptx-export';
import { getUserCredits, canDownload, requestPremiumUpgrade, completePremiumUpgrade, type UserCredits } from '@/lib/payment';
import { cn, scoreColor, scoreBg } from '@/lib/utils';
import {
  AUDIENCE_LABELS,
  type Audience,
  type Deck,
  type ElevatorPitch,
  type ExtractedAnalysis,
  type HealthScores,
  type InvestorQA,
  type Project,
  type Slide,
  type BlockchainRecord,
} from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Mic,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Clock,
  Maximize2,
  X,
  Sparkles,
  Lock,
  Zap,
  CheckCircle2,
  Loader2,
  CreditCard,
} from 'lucide-react';

type Tab = 'slides' | 'notes' | 'elevator' | 'questions' | 'health' | 'verify';

export function DeckPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const notify = useToast();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [record, setRecord] = useState<BlockchainRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [tab, setTab] = useState<Tab>('slides');
  const [fullscreen, setFullscreen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeState, setUpgradeState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [pendingExport, setPendingExport] = useState<'pptx' | 'pdf' | null>(null);

  useEffect(() => {
    loadDeck();
  }, [deckId]);

  async function loadDeck() {
    if (!deckId) return;
    const { data, error } = await supabase
      .from('decks')
      .select('*, project:projects(*)')
      .eq('id', deckId)
      .maybeSingle();

    if (error || !data) {
      notify('error', 'Deck not found.');
      navigate('/dashboard');
      return;
    }

    const d = data as Deck & { project: Project };
    setDeck(d);
    setProject(d.project);

    const { data: rec } = await supabase
      .from('blockchain_records')
      .select('*')
      .eq('deck_id', deckId)
      .maybeSingle();
    setRecord(rec as BlockchainRecord | null);

    setLoading(false);

    try {
      const c = await getUserCredits();
      setCredits(c);
    } catch {
      // non-fatal
    }
  }

  async function handleExportPptx() {
    if (!deck) return;
    if (!credits || !canDownload(credits)) {
      setPendingExport('pptx');
      setShowUpgrade(true);
      return;
    }
    setExporting(true);
    try {
      await exportPptx(deck);
      notify('success', 'PPTX downloaded!');
    } catch (err) {
      notify('error', 'Export failed. Please try again.');
    }
    setExporting(false);
  }

  async function handleExportPdf() {
    if (!deck) return;
    if (!credits || !canDownload(credits)) {
      setPendingExport('pdf');
      setShowUpgrade(true);
      return;
    }
    setExporting(true);
    try {
      await exportNotesPdf(deck);
      notify('success', 'Presenter notes PDF downloaded!');
    } catch (err) {
      notify('error', 'Export failed. Please try again.');
    }
    setExporting(false);
  }

  async function handleUpgrade() {
    setUpgradeState('processing');
    try {
      const challenge = await requestPremiumUpgrade();
      await new Promise((r) => setTimeout(r, 2000));
      const updated = await completePremiumUpgrade(challenge.paymentId);
      setCredits(updated);
      setUpgradeState('success');
      notify('success', 'Premium activated! Downloading...');
      await new Promise((r) => setTimeout(r, 1500));
      setShowUpgrade(false);
      setUpgradeState('idle');
      if (pendingExport === 'pptx') {
        setPendingExport(null);
        setExporting(true);
        try { await exportPptx(deck); } catch { /* handled below */ }
        setExporting(false);
      } else if (pendingExport === 'pdf') {
        setPendingExport(null);
        setExporting(true);
        try { await exportNotesPdf(deck); } catch { /* handled */ }
        setExporting(false);
      }
    } catch (err) {
      setUpgradeState('idle');
      notify('error', 'Payment failed. Please try again.');
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <PageLoader label="Loading your pitch deck…" />
      </AppLayout>
    );
  }

  if (!deck || !project) return null;

  const slides = deck.slides as Slide[];
  const notes = (deck.presenter_notes ?? []) as { slideId: string; text: string }[];
  const elevator = deck.elevator_pitches as ElevatorPitch | null;
  const questions = (deck.investor_questions ?? []) as InvestorQA[];
  const analysis = project.extracted_json as ExtractedAnalysis;
  const health = project.health_scores as HealthScores | null;
  const currentSlide = slides[slideIndex];

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info">{AUDIENCE_LABELS[deck.audience as Audience]}</Badge>
              {record && (
                <Link to={`/verify?id=${record.verification_id}`}>
                  <Badge variant="success"><ShieldCheck className="h-3 w-3" /> Verified</Badge>
                </Link>
              )}
            </div>
            <h1 className="font-display text-2xl font-bold">{project.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExportPdf} loading={exporting}>
              <FileText className="h-4 w-4" />
              Notes PDF
            </Button>
            <Button size="sm" onClick={handleExportPptx} loading={exporting}>
              <Download className="h-4 w-4" />
              Export PPTX
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6 border-b border-white/5 pb-3">
          {([
            { id: 'slides', label: 'Slide Preview', icon: Maximize2 },
            { id: 'notes', label: 'Presenter Notes', icon: Mic },
            { id: 'elevator', label: 'Elevator Pitch', icon: Sparkles },
            { id: 'questions', label: 'Investor Q&A', icon: HelpCircle },
            { id: 'health', label: 'Health Score', icon: TrendingUp },
            { id: 'verify', label: 'Blockchain', icon: ShieldCheck },
          ] as const).map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
                  tab === t.id ? 'text-ink bg-violet-500/15 border border-violet-400/20' : 'text-ink-muted hover:text-ink hover:bg-white/5',
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Slides tab */}
        {tab === 'slides' && (
          <div>
            <SlidePreview slide={currentSlide} audience={deck.audience as Audience} slideIndex={slideIndex} total={slides.length} />
            <div className="flex items-center justify-between mt-4">
              <Button variant="secondary" size="sm" onClick={() => setSlideIndex((i) => Math.max(0, i - 1))} disabled={slideIndex === 0}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-ink-dim">{slideIndex + 1} / {slides.length}</span>
              <Button variant="secondary" size="sm" onClick={() => setSlideIndex((i) => Math.min(slides.length - 1, i + 1))} disabled={slideIndex === slides.length - 1}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Slide thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-3 mt-5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSlideIndex(i)}
                  className={cn(
                    'shrink-0 w-32 h-18 rounded-lg p-2 text-left text-[10px] border transition-all',
                    i === slideIndex ? 'border-violet-400/50 bg-violet-500/10' : 'border-white/10 bg-white/5 hover:border-violet-400/20',
                  )}
                >
                  <div className="text-ink-muted font-medium truncate">{i + 1}. {s.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes tab */}
        {tab === 'notes' && (
          <div className="space-y-3">
            {slides.map((slide, i) => {
              const note = notes.find((n) => n.slideId === slide.id);
              return (
                <Card key={slide.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 text-xs font-bold text-violet-300">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink text-sm mb-1">{slide.title}</h3>
                      <p className="text-sm text-ink-muted leading-relaxed">{note?.text ?? 'No notes available.'}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Elevator pitch tab */}
        {tab === 'elevator' && elevator && (
          <div className="space-y-4">
            {[
              { label: '30 Seconds', icon: Clock, content: elevator.thirtySeconds },
              { label: '60 Seconds', icon: Clock, content: elevator.sixtySeconds },
              { label: '3 Minutes', icon: Clock, content: elevator.threeMinutes },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.label} className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-5 w-5 text-violet-400" />
                    <h3 className="font-semibold text-ink">{p.label}</h3>
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">{p.content}</p>
                </Card>
              );
            })}
          </div>
        )}

        {/* Q&A tab */}
        {tab === 'questions' && (
          <div className="space-y-3">
            {questions.map((qa, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-ink text-sm mb-1.5">Q{i + 1}. {qa.question}</p>
                    <p className="text-sm text-ink-muted leading-relaxed">{qa.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Health tab */}
        {tab === 'health' && health && (
          <div className="space-y-5">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold">Startup Health Score</h3>
                <div className="text-right">
                  <div className={cn('text-4xl font-bold', scoreColor(health.overall))}>{health.overall}</div>
                  <div className="text-xs text-ink-dim">Overall / 100</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {([
                  ['Innovation', health.innovation],
                  ['Market', health.market],
                  ['Business', health.business],
                  ['Scalability', health.scalability],
                  ['Presentation', health.presentation],
                  ['Investment Readiness', health.investmentReadiness],
                ] as const).map(([label, score]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-ink-muted">{label}</span>
                      <span className={cn('font-semibold', scoreColor(score))}>{score}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all', scoreBg(score))} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-400" />
                AI Suggestions
              </h3>
              <div className="space-y-2">
                {health.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-white/5">
                    <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <p className="text-sm text-ink-muted">{s}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Verify tab */}
        {tab === 'verify' && record && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Algorand Verification</h3>
                <p className="text-xs text-ink-dim">Recorded on {record.network}</p>
              </div>
            </div>
            <div className="space-y-3">
              <VerifyRow label="Verification ID" value={record.verification_id} />
              <VerifyRow label="Generation ID" value={record.generation_id} />
              <VerifyRow label="Deck Hash (SHA-256)" value={record.deck_hash} mono />
              <VerifyRow label="Transaction ID" value={record.tx_id ?? '—'} mono />
              <VerifyRow label="Recorded At" value={new Date(record.recorded_at).toLocaleString()} />
            </div>
            <Link to={`/verify?id=${record.verification_id}`}>
              <Button variant="secondary" className="w-full mt-5">
                Open verification page
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Fullscreen slide */}
      {fullscreen && currentSlide && (
        <div className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setFullscreen(false)}>
          <button className="absolute top-6 right-6 text-ink-muted hover:text-ink">
            <X className="h-6 w-6" />
          </button>
          <div className="w-full max-w-4xl">
            <SlidePreview slide={currentSlide} audience={deck.audience as Audience} slideIndex={slideIndex} total={slides.length} large />
          </div>
        </div>
      )}

      {/* x402 Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => upgradeState === 'idle' && setShowUpgrade(false)}>
          <Card className="max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
            {upgradeState === 'idle' && (
              <button onClick={() => setShowUpgrade(false)} className="absolute top-4 right-4 text-ink-dim hover:text-ink transition-colors">
                <X className="h-5 w-5" />
              </button>
            )}

            {upgradeState === 'idle' && (
              <>
                <div className="h-14 w-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
                  <Lock className="h-7 w-7 text-violet-400" />
                </div>
                <h2 className="font-display text-xl font-bold text-center mb-2">Upgrade to Premium</h2>
                <p className="text-sm text-ink-muted text-center mb-5">
                  {pendingExport === 'pptx' ? 'PPTX download' : 'PDF download'} is a Premium feature. Unlock unlimited downloads and generations.
                </p>

                <div className="space-y-2.5 mb-6">
                  {[
                    'Unlimited Pitch Generations',
                    'PPT & PDF Downloads',
                    'Unlimited History',
                    'Faster AI Processing',
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm text-ink">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-5 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <div>
                    <div className="text-xs text-ink-dim">One-time payment</div>
                    <div className="text-2xl font-bold text-gradient">$29</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ink-dim">x402 Protocol</div>
                    <div className="text-sm font-medium text-violet-300">Algorand Testnet</div>
                  </div>
                </div>

                <Button onClick={handleUpgrade} size="lg" className="w-full">
                  <CreditCard className="h-5 w-5" />
                  Upgrade Now — $29
                </Button>
                <p className="text-center text-xs text-ink-dim mt-3">
                  Simulated payment for demo purposes. No real charge.
                </p>
              </>
            )}

            {upgradeState === 'processing' && (
              <div className="text-center py-6">
                <div className="h-14 w-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
                  <Loader2 className="h-7 w-7 text-violet-400 animate-spin" />
                </div>
                <h2 className="font-display text-xl font-bold mb-2">Processing Payment...</h2>
                <p className="text-sm text-ink-muted mb-4">Confirming x402 payment on Algorand Testnet</p>
                <div className="flex items-center justify-center gap-2 text-xs text-ink-dim">
                  <Zap className="h-3.5 w-3.5 text-violet-400" />
                  HTTP 402 Payment Required
                </div>
              </div>
            )}

            {upgradeState === 'success' && (
              <div className="text-center py-6">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                </div>
                <h2 className="font-display text-xl font-bold mb-2">Premium Activated!</h2>
                <p className="text-sm text-ink-muted mb-4">Your download will start automatically.</p>
                <Badge variant="accent" className="mx-auto"><Sparkles className="h-3 w-3" /> Premium</Badge>
              </div>
            )}
          </Card>
        </div>
      )}
    </AppLayout>
  );
}

function SlidePreview({ slide, audience, slideIndex, total, large }: { slide: Slide; audience: Audience; slideIndex: number; total: number; large?: boolean }) {
  if (!slide) return null;
  const isTitle = slide.type === 'title' || slide.type === 'closing';

  return (
    <div className={cn(
      'relative rounded-2xl overflow-hidden border border-violet-500/15',
      large ? 'aspect-video' : 'aspect-video',
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-surface-2 to-bg" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />

      <div className="relative h-full flex flex-col p-6 sm:p-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-bold text-violet-300 tracking-widest uppercase">{AUDIENCE_LABELS[audience]}</span>
          <span className="text-[10px] text-ink-dim">{slideIndex + 1} / {total}</span>
        </div>

        {isTitle ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className={cn('font-display font-bold text-gradient mb-3', large ? 'text-5xl' : 'text-3xl sm:text-4xl')}>
              {slide.title}
            </h1>
            {slide.subtitle && <p className={cn('text-ink-muted', large ? 'text-xl' : 'text-base sm:text-lg')}>{slide.subtitle}</p>}
            {slide.highlight && <p className="text-sm text-violet-300 italic mt-4">{slide.highlight}</p>}
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <h2 className={cn('font-display font-bold text-ink mb-4', large ? 'text-3xl' : 'text-xl sm:text-2xl')}>
              {slide.title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 flex-1">
              {slide.body && (
                <p className={cn('text-ink-muted leading-relaxed', large ? 'text-lg' : 'text-sm')}>{slide.body}</p>
              )}
              {slide.bullets && slide.bullets.length > 0 && (
                <ul className="space-y-2">
                  {slide.bullets.map((b, i) => (
                    <li key={i} className={cn('flex items-start gap-2 text-ink', large ? 'text-base' : 'text-sm')}>
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0 mt-2" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {slide.highlight && (
              <div className="mt-4 inline-block self-start rounded-lg bg-violet-500/10 border border-violet-500/20 px-4 py-2">
                <span className="text-sm font-semibold text-violet-300">{slide.highlight}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function VerifyRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-white/5">
      <span className="text-xs text-ink-dim">{label}</span>
      <span className={cn('text-sm text-ink text-right', mono && 'font-mono text-xs')}>{value}</span>
    </div>
  );
}
