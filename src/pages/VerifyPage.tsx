import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';
import { verifyDeck } from '@/lib/blockchain';
import { cn } from '@/lib/utils';
import type { BlockchainRecord, Deck, Project } from '@/types';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Link2,
  ArrowRight,
} from 'lucide-react';

export function VerifyPage() {
  const [params] = useSearchParams();
  const notify = useToast();
  const [query, setQuery] = useState(params.get('id') ?? '');
  const [record, setRecord] = useState<BlockchainRecord | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'verifying' | 'valid' | 'invalid' | 'notfound'>('idle');
  const [computedHash, setComputedHash] = useState<string | null>(null);

  useEffect(() => {
    const id = params.get('id');
    if (id) {
      setQuery(id);
      handleSearch(id);
    }
  }, [params]);

  async function handleSearch(id?: string) {
    const verificationId = (id ?? query).trim();
    if (!verificationId) return;

    setStatus('searching');
    setRecord(null);
    setDeck(null);
    setProject(null);
    setComputedHash(null);

    const { data, error } = await supabase
      .from('blockchain_records')
      .select('*')
      .eq('verification_id', verificationId)
      .maybeSingle();

    if (error || !data) {
      setStatus('notfound');
      return;
    }

    setRecord(data as BlockchainRecord);

    const { data: deckData } = await supabase
      .from('decks')
      .select('*, project:projects(*)')
      .eq('id', (data as BlockchainRecord).deck_id)
      .maybeSingle();

    if (deckData) {
      const d = deckData as Deck & { project: Project };
      setDeck(d);
      setProject(d.project);
      setStatus('found');
      handleVerify(d, data as BlockchainRecord);
    } else {
      setStatus('found');
    }
  }

  async function handleVerify(d: Deck, rec: BlockchainRecord) {
    setStatus('verifying');
    try {
      const result = await verifyDeck(d, rec);
      setComputedHash(result.computedHash);
      setStatus(result.valid ? 'valid' : 'invalid');
      if (result.valid) {
        notify('success', 'Deck verified — content is authentic.');
      } else {
        notify('error', 'Hash mismatch — deck has been modified.');
      }
    } catch {
      setStatus('invalid');
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="mb-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Verify a Pitch Deck</h1>
          <p className="text-ink-muted max-w-lg mx-auto">
            Every PitchForge deck is recorded on the Algorand blockchain. Enter a verification ID to confirm the deck has not been modified.
          </p>
        </div>

        {/* Search */}
        <Card className="p-5 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-dim" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="ALGO-VRF-XXXXXXXXXXXX"
                className="w-full rounded-xl bg-surface-2/60 border border-violet-500/15 pl-10 pr-4 py-2.5 text-ink placeholder:text-ink-dim focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20 transition-all font-mono text-sm"
              />
            </div>
            <Button onClick={() => handleSearch()} disabled={status === 'searching' || status === 'verifying'}>
              {status === 'searching' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Verify
            </Button>
          </div>
        </Card>

        {/* Status */}
        {status === 'notfound' && (
          <Card className="p-8 text-center">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-7 w-7 text-rose-400" />
            </div>
            <h3 className="font-semibold text-ink mb-1.5">No record found</h3>
            <p className="text-sm text-ink-muted">No deck with that verification ID exists on the Algorand testnet record.</p>
          </Card>
        )}

        {record && (status === 'found' || status === 'verifying' || status === 'valid' || status === 'invalid') && (
          <>
            {/* Verification result banner */}
            {(status === 'valid' || status === 'invalid') && (
              <Card className={cn('p-6 mb-5', status === 'valid' ? 'border-emerald-500/30' : 'border-rose-500/30')}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'h-14 w-14 rounded-2xl flex items-center justify-center shrink-0',
                    status === 'valid' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20',
                  )}>
                    {status === 'valid' ? <CheckCircle2 className="h-7 w-7 text-emerald-400" /> : <XCircle className="h-7 w-7 text-rose-400" />}
                  </div>
                  <div>
                    <h3 className={cn('font-display text-lg font-bold', status === 'valid' ? 'text-emerald-300' : 'text-rose-300')}>
                      {status === 'valid' ? 'Deck Verified — Authentic' : 'Verification Failed — Modified'}
                    </h3>
                    <p className="text-sm text-ink-muted">
                      {status === 'valid'
                        ? 'The deck content matches the hash recorded on Algorand. This deck has not been modified.'
                        : 'The current deck content does not match the recorded hash. This deck has been altered since generation.'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Record details */}
            <Card className="p-6">
              <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-violet-400" />
                Blockchain Record
              </h3>
              <div className="space-y-3">
                <Row label="Verification ID" value={record.verification_id} mono />
                <Row label="Generation ID" value={record.generation_id} mono />
                <Row label="Network" value={record.network} />
                <Row label="Transaction ID" value={record.tx_id ?? '—'} mono />
                <Row label="Recorded Hash" value={record.deck_hash} mono />
                {computedHash && (
                  <Row label="Computed Hash" value={computedHash} mono highlight={status === 'valid'} />
                )}
                <Row label="Recorded At" value={new Date(record.recorded_at).toLocaleString()} />
              </div>
            </Card>

            {/* Deck info */}
            {project && (
              <Card className="p-6 mt-5">
                <h3 className="font-semibold text-ink mb-3">Associated Deck</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink">{project.name}</p>
                    <p className="text-xs text-ink-dim mt-0.5">Audience: {deck?.audience}</p>
                  </div>
                  {deck && (
                    <Button variant="secondary" size="sm" onClick={() => window.location.assign(`/deck/${deck.id}`)}>
                      View deck
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </>
        )}

        {status === 'idle' && (
          <Card className="p-8 text-center">
            <div className="h-14 w-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7 text-violet-400" />
            </div>
            <h3 className="font-semibold text-ink mb-1.5">Enter a verification ID</h3>
            <p className="text-sm text-ink-muted">Find the ID on any generated deck's Blockchain tab.</p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

function Row({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-white/5">
      <span className="text-xs text-ink-dim shrink-0">{label}</span>
      <span className={cn('text-sm text-right', mono ? 'font-mono text-xs' : '', highlight ? 'text-emerald-300' : 'text-ink')}>{value}</span>
    </div>
  );
}
