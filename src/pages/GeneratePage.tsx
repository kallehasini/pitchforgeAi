import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';
import {
  analyzeDocument,
  generateSlides,
  generatePresenterNotes,
  generateElevatorPitches,
  generateInvestorQuestions,
  getAudienceOptimization,
} from '@/lib/ai-engine';
import { createVerification } from '@/lib/blockchain';
import { getUserCredits, canGenerate, decrementCredit, type UserCredits } from '@/lib/payment';
import { cn, sleep } from '@/lib/utils';
import { AUDIENCE_LABELS, AUDIENCE_DESCRIPTIONS, type Audience, type ExtractedAnalysis, type Project } from '@/types';
import {
  Target,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Zap,
  Gift,
} from 'lucide-react';

const LOADING_STEPS = [
  'Understanding README...',
  'Extracting Business Model...',
  'Analyzing Competition...',
  'Preparing Story...',
  'Optimizing for Selected Audience...',
  'Generating Slides...',
  'Creating PPT...',
  'Saving Verification...',
  'Completed.',
];

export function GeneratePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const notify = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null);
  const [generating, setGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, [projectId]);

  async function loadData() {
    if (!projectId) return;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (error || !data) {
      notify('error', 'Project not found.');
      navigate('/dashboard');
      return;
    }
    setProject(data as Project);

    try {
      const c = await getUserCredits();
      setCredits(c);
    } catch {
      // non-fatal
    }
    setLoading(false);
  }

  async function handleGenerate() {
    if (!project || !selectedAudience || !credits) return;

    if (!canGenerate(credits)) {
      notify('error', 'You have no free generations left. Upgrade to Premium for unlimited generations.');
      return;
    }

    setGenerating(true);
    setStepIndex(0);

    try {
      await stepDelay(0);
      await stepDelay(1);

      const analysis: ExtractedAnalysis =
        (project.extracted_json as ExtractedAnalysis) ?? analyzeDocument(project.raw_text ?? '');
      await stepDelay(2);
      await stepDelay(3);

      const opt = getAudienceOptimization(selectedAudience);
      await stepDelay(4);

      const slides = generateSlides(analysis, opt);
      const notes = generatePresenterNotes(slides, opt);
      await stepDelay(5);

      const elevator = generateElevatorPitches(analysis);
      const questions = generateInvestorQuestions(analysis);
      await stepDelay(6);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be signed in.');

      const { data: deck, error: deckError } = await supabase
        .from('decks')
        .insert({
          project_id: project.id,
          user_id: user.id,
          audience: selectedAudience,
          slides,
          presenter_notes: notes,
          elevator_pitches: elevator,
          investor_questions: questions,
        })
        .select()
        .single();

      if (deckError || !deck) throw new Error(deckError?.message ?? 'Could not save deck.');

      const verification = await createVerification(deck);
      await stepDelay(7);

      const { error: recordError } = await supabase
        .from('blockchain_records')
        .insert({
          deck_id: deck.id,
          user_id: user.id,
          deck_hash: verification.deckHash,
          verification_id: verification.verificationId,
          generation_id: verification.generationId,
          tx_id: verification.txId,
          network: verification.network,
        });

      if (recordError) throw new Error('Blockchain verification failed.');

      // Decrement credit for free users
      if (!credits.is_premium) {
        const updated = await decrementCredit();
        setCredits(updated);
      }

      await stepDelay(8);
      setGenerating(false);
      notify('success', 'Pitch deck generated and verified on Algorand!');
      navigate(`/deck/${deck.id}`);
    } catch (err) {
      setGenerating(false);
      const msg = err instanceof Error ? err.message : 'Generation failed.';
      notify('error', msg);
    }
  }

  async function stepDelay(index: number) {
    setStepIndex(index);
    await sleep(700 + Math.random() * 500);
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!project || !credits) return null;

  const isPremium = credits.is_premium;
  const remainingCredits = credits.free_credits;

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Generate your pitch deck</h1>
          <p className="text-ink-muted">
            Project: <span className="text-ink font-medium">{project.name}</span>
          </p>
        </div>

        {/* Credit status banner */}
        {!generating && (
          <Card className={cn('p-5 mb-6', isPremium ? 'border-violet-500/30' : 'border-amber-500/20')}>
            <div className="flex items-center gap-3">
              <div className={cn(
                'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                isPremium ? 'bg-violet-500/10' : 'bg-amber-500/10',
              )}>
                {isPremium ? <Zap className="h-5 w-5 text-violet-400" /> : <Gift className="h-5 w-5 text-amber-400" />}
              </div>
              <div className="flex-1">
                {isPremium ? (
                  <>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-ink">Premium Plan Active</h3>
                      <Badge variant="accent"><Sparkles className="h-3 w-3" /> Premium</Badge>
                    </div>
                    <p className="text-sm text-ink-muted">Unlimited pitch generations.</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-ink">Free Pitch Credits</h3>
                      <Badge variant={remainingCredits > 0 ? 'warning' : 'error'}>
                        {remainingCredits} / 4
                      </Badge>
                    </div>
                    <p className="text-sm text-ink-muted">
                      {remainingCredits > 0
                        ? `${remainingCredits} free generation${remainingCredits === 1 ? '' : 's'} remaining.`
                        : 'No free generations left. Upgrade to Premium for unlimited generations.'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Audience selection */}
        {!generating && (
          <>
            <Card className="p-6 mb-6">
              <h2 className="font-semibold text-ink mb-1 flex items-center gap-2">
                <Target className="h-5 w-5 text-violet-400" />
                Choose your audience
              </h2>
              <p className="text-sm text-ink-muted mb-5">
                The AI retunes story, slide order, tone, and technical depth for each audience.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {(Object.keys(AUDIENCE_LABELS) as Audience[]).map((aud) => {
                  const selected = selectedAudience === aud;
                  return (
                    <button
                      key={aud}
                      onClick={() => setSelectedAudience(aud)}
                      className={cn(
                        'text-left p-4 rounded-xl border transition-all',
                        selected
                          ? 'border-violet-400/50 bg-violet-500/10 shadow-glow'
                          : 'border-white/10 bg-white/5 hover:border-violet-400/30',
                      )}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium text-ink">{AUDIENCE_LABELS[aud]}</span>
                        {selected && <CheckCircle2 className="h-4 w-4 text-violet-400" />}
                      </div>
                      <p className="text-xs text-ink-dim">{AUDIENCE_DESCRIPTIONS[aud]}</p>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Button
              onClick={handleGenerate}
              disabled={!selectedAudience || (!isPremium && remainingCredits <= 0)}
              size="lg"
              className="w-full group"
            >
              <Sparkles className="h-5 w-5" />
              Generate Pitch Deck
              <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>

            {!isPremium && remainingCredits <= 0 && (
              <p className="text-center text-sm text-amber-400 mt-3 flex items-center justify-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                No free credits left — upgrade to Premium to continue generating.
              </p>
            )}
          </>
        )}

        {/* Loading experience */}
        {generating && (
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
                <Sparkles className="h-4 w-4 text-fuchsia-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Forging your pitch...</h2>
                <p className="text-sm text-ink-muted">This takes about 15 seconds.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {LOADING_STEPS.map((step, i) => {
                const done = i < stepIndex;
                const active = i === stepIndex;
                return (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg transition-all',
                      done && 'opacity-60',
                      active && 'bg-violet-500/10 border border-violet-400/20',
                      !done && !active && 'opacity-30',
                    )}
                  >
                    <div className="shrink-0">
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : active ? (
                        <Loader2 className="h-5 w-5 text-violet-400 animate-spin" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-white/10" />
                      )}
                    </div>
                    <span className={cn('text-sm', done ? 'text-ink-muted' : active ? 'text-ink font-medium' : 'text-ink-dim')}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
