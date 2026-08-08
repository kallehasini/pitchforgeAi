import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { timeAgo, audienceGradient } from '@/lib/utils';
import { getUserCredits, FREE_CREDIT_LIMIT, type UserCredits } from '@/lib/payment';
import { AUDIENCE_LABELS, type Audience, type Deck, type Project, type BlockchainRecord } from '@/types';
import {
  Upload,
  FileText,
  Layers,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Clock,
  Plus,
  BarChart3,
  Coins,
  Target,
  Zap,
  Gift,
  Lock,
} from 'lucide-react';

interface DashboardData {
  projects: Project[];
  decks: (Deck & { project?: Project })[];
  blockchainRecords: BlockchainRecord[];
}

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [projectsRes, decksRes, recordsRes] = await Promise.all([
      supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('decks').select('*, project:projects(*)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('blockchain_records').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    ]);

    setData({
      projects: (projectsRes.data as Project[]) ?? [],
      decks: (decksRes.data as (Deck & { project?: Project })[]) ?? [],
      blockchainRecords: (recordsRes.data as BlockchainRecord[]) ?? [],
    });

    try {
      const c = await getUserCredits();
      setCredits(c);
    } catch {
      // non-fatal
    }
    setLoading(false);
  }

  if (loading || !data) {
    return (
      <AppLayout>
        <PageLoader label="Loading your dashboard…" />
      </AppLayout>
    );
  }

  const isPremium = credits?.is_premium ?? false;
  const freeCredits = credits?.free_credits ?? FREE_CREDIT_LIMIT;

  // Free users see latest 4 generations; premium sees all
  const visibleDecks = isPremium ? data.decks : data.decks.slice(0, 4);
  const totalDecks = data.decks.length;
  const totalProjects = data.projects.length;
  const totalVerified = data.blockchainRecords.length;
  const audiences = new Set(data.decks.map((d) => d.audience)).size;

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Welcome card */}
        <Card className="p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 bg-violet-600/15 rounded-full blur-[80px]" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-ink-dim mb-1">Welcome back</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                {user?.email?.split('@')[0] ?? 'Founder'} 👋
              </h1>
              <p className="text-sm text-ink-muted mt-2 max-w-md">
                Ready to forge a new pitch? Upload a README and let the AI build your deck.
              </p>
            </div>
            <Link to="/upload">
              <Button size="lg" className="group">
                <Plus className="h-5 w-5" />
                Generate New Pitch
              </Button>
            </Link>
          </div>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FileText} label="Projects" value={totalProjects} gradient="from-violet-500 to-fuchsia-500" />
          <StatCard icon={Layers} label="Decks Generated" value={totalDecks} gradient="from-cyan-500 to-blue-600" />
          <StatCard icon={ShieldCheck} label="Verified on Algorand" value={totalVerified} gradient="from-emerald-500 to-teal-600" />
          <StatCard icon={Target} label="Audience Variants" value={audiences} gradient="from-amber-500 to-orange-600" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-violet-400" />
                Recent Projects
              </h2>
              {totalProjects > 0 && <span className="text-sm text-ink-dim">{totalProjects} total</span>}
            </div>

            {data.projects.length === 0 ? (
              <Card className="p-10 text-center">
                <div className="h-14 w-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-7 w-7 text-violet-400" />
                </div>
                <h3 className="font-semibold text-ink mb-1.5">No projects yet</h3>
                <p className="text-sm text-ink-muted mb-5">Upload your first README to get started.</p>
                <Link to="/upload">
                  <Button>
                    <Upload className="h-4 w-4" />
                    Upload README
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {data.projects.map((project) => {
                  const projectDecks = data.decks.filter((d) => d.project_id === project.id);
                  return (
                    <Card key={project.id} hover className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-ink truncate">{project.name}</h3>
                            <Badge variant="accent">{project.source_type.toUpperCase()}</Badge>
                          </div>
                          <p className="text-xs text-ink-dim mb-2">Created {timeAgo(project.created_at)}</p>
                          {projectDecks.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {projectDecks.slice(0, 3).map((d) => (
                                <Link key={d.id} to={`/deck/${d.id}`}>
                                  <Badge variant="info" className="hover:bg-cyan-500/20 transition-colors cursor-pointer">
                                    {AUDIENCE_LABELS[d.audience as Audience]}
                                  </Badge>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <Link to={`/upload?project=${project.id}`}>
                              <span className="text-xs text-violet-400 hover:text-violet-300">Generate a pitch →</span>
                            </Link>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {project.health_scores && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gradient">{(project.health_scores as { overall: number }).overall}</div>
                              <div className="text-[10px] text-ink-dim">health score</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar: Blockchain status + quick actions */}
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Blockchain Status
              </h3>
              {data.blockchainRecords.length === 0 ? (
                <p className="text-sm text-ink-muted">No decks verified yet. Generate a pitch to record it on Algorand.</p>
              ) : (
                <div className="space-y-3">
                  {data.blockchainRecords.slice(0, 3).map((rec) => (
                    <Link key={rec.id} to={`/verify?id=${rec.verification_id}`} className="block">
                      <div className="rounded-lg bg-white/5 border border-white/5 p-3 hover:border-emerald-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-medium text-emerald-300">Verified</span>
                        </div>
                        <p className="text-xs text-ink-muted font-mono truncate">{rec.verification_id}</p>
                        <p className="text-[10px] text-ink-dim mt-0.5">{rec.network} • {timeAgo(rec.created_at)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-400" />
                x402 Payment
              </h3>
              <p className="text-sm text-ink-muted mb-3">
                Pitch generation is protected by the x402 protocol. Each generation costs 5 USDC.
              </p>
              <div className="flex items-center gap-2 text-xs text-ink-dim">
                <Badge variant="warning">5 USDC / deck</Badge>
                <Badge variant="success">Mock mode</Badge>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link to="/upload" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                  <span className="text-sm text-ink-muted flex items-center gap-2"><Upload className="h-4 w-4" /> Upload new README</span>
                  <ArrowRight className="h-4 w-4 text-ink-dim group-hover:text-violet-400 transition-colors" />
                </Link>
                <Link to="/verify" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                  <span className="text-sm text-ink-muted flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Verify a deck</span>
                  <ArrowRight className="h-4 w-4 text-ink-dim group-hover:text-violet-400 transition-colors" />
                </Link>
                <Link to="/settings" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                  <span className="text-sm text-ink-muted flex items-center gap-2"><Sparkles className="h-4 w-4" /> Settings</span>
                  <ArrowRight className="h-4 w-4 text-ink-dim group-hover:text-violet-400 transition-colors" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value, gradient }: { icon: typeof FileText; label: string; value: number; gradient: string }) {
  return (
    <Card className="p-5">
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-3`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-ink">{value}</div>
      <div className="text-xs text-ink-dim">{label}</div>
    </Card>
  );
}
