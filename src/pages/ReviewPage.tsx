import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { ExtractedAnalysis, Project } from '@/types';
import {
  ArrowRight,
  ArrowLeft,
  Edit3,
  Save,
  Check,
  FileText,
  Lightbulb,
  Target,
  Cpu,
  Users,
  DollarSign,
  TrendingUp,
  Trophy,
  Rocket,
} from 'lucide-react';

type FieldValue = string | string[];

const FIELDS: { key: keyof ExtractedAnalysis; label: string; icon: typeof FileText; isArray?: boolean }[] = [
  { key: 'projectName', label: 'Project Name', icon: FileText },
  { key: 'problem', label: 'Problem Statement', icon: Lightbulb },
  { key: 'solution', label: 'Solution', icon: Target },
  { key: 'features', label: 'Features', icon: Check, isArray: true },
  { key: 'techStack', label: 'Technology Stack', icon: Cpu, isArray: true },
  { key: 'targetUsers', label: 'Target Users', icon: Users, isArray: true },
  { key: 'businessModel', label: 'Business Model', icon: DollarSign },
  { key: 'revenueModel', label: 'Revenue Model', icon: DollarSign },
  { key: 'market', label: 'Market Opportunity', icon: TrendingUp },
  { key: 'competition', label: 'Competitor Analysis', icon: Trophy },
  { key: 'futureScope', label: 'Future Scope', icon: Rocket },
];

function fieldValueToString(val: FieldValue): string {
  return Array.isArray(val) ? val.join('\n') : (val as string);
}

function stringToFieldValue(val: string, isArray?: boolean): FieldValue {
  if (!isArray) return val;
  return val.split('\n').map((s) => s.trim()).filter(Boolean);
}

export function ReviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const notify = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [analysis, setAnalysis] = useState<ExtractedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  async function loadProject() {
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

    const p = data as Project;
    setProject(p);
    setAnalysis((p.extracted_json as ExtractedAnalysis) ?? null);
    setLoading(false);
  }

  function updateField(key: keyof ExtractedAnalysis, value: string, isArray?: boolean) {
    if (!analysis) return;
    setAnalysis({ ...analysis, [key]: stringToFieldValue(value, isArray) });
  }

  async function saveEdits() {
    if (!project || !analysis) return;
    setSaving(true);
    const { error } = await supabase
      .from('projects')
      .update({ extracted_json: analysis, updated_at: new Date().toISOString() })
      .eq('id', project.id);

    if (error) {
      notify('error', 'Could not save changes.');
    } else {
      notify('success', 'Changes saved!');
      setEditing(false);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <AppLayout>
        <PageLoader label="Loading analysis..." />
      </AppLayout>
    );
  }

  if (!project || !analysis) return null;

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <div className="mb-6">
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to upload
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">AI Analysis Review</h1>
              <p className="text-ink-muted">
                Review the extracted information. Edit anything that needs correcting before generating your pitch deck.
              </p>
            </div>
            <Badge variant="accent">{project.source_type.toUpperCase()}</Badge>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {editing ? (
            <>
              <Button onClick={saveEdits} loading={saving} className="flex-1">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setAnalysis((project.extracted_json as ExtractedAnalysis) ?? null);
                  setEditing(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setEditing(true)} className="flex-1">
                <Edit3 className="h-4 w-4" />
                Edit Information
              </Button>
              <Button onClick={() => navigate(`/generate/${projectId}`)} className="flex-1 group">
                Continue to Generate Pitch
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {FIELDS.map((field) => {
            const Icon = field.icon;
            const rawValue = analysis[field.key];
            const valueStr = fieldValueToString(rawValue as FieldValue);
            const isLong = field.isArray || valueStr.length > 80;
            return (
              <Card key={field.key} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4.5 w-4.5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs font-medium text-ink-dim uppercase tracking-wide mb-1.5 block">
                      {field.label}
                    </label>
                    {editing ? (
                      isLong ? (
                        <textarea
                          value={valueStr}
                          onChange={(e) => updateField(field.key, e.target.value, field.isArray)}
                          rows={field.isArray ? 4 : 4}
                          className="w-full rounded-lg bg-surface-2/60 border border-violet-500/15 px-3 py-2 text-sm text-ink focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-y"
                        />
                      ) : (
                        <input
                          value={valueStr}
                          onChange={(e) => updateField(field.key, e.target.value, field.isArray)}
                          className="w-full rounded-lg bg-surface-2/60 border border-violet-500/15 px-3 py-2 text-sm text-ink focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                        />
                      )
                    ) : (
                      <p className={cn('text-sm text-ink leading-relaxed', isLong && 'whitespace-pre-line')}>
                        {valueStr}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom continue */}
        <div className="mt-6">
          <Button onClick={() => navigate(`/generate/${projectId}`)} size="lg" className="w-full group">
            <ArrowRight className="h-5 w-5" />
            Continue to Generate Pitch
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
