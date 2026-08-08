import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/ToastProvider';
import { parseFile, detectSourceType } from '@/lib/file-parser';
import { analyzeDocument, scoreHealth, getAllAudienceOptimizations } from '@/lib/ai-engine';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { SourceType } from '@/types';
import {
  UploadCloud,
  FileText,
  File,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';

const ACCEPTED_EXTS = ['.md', '.markdown', '.txt', '.pdf', '.docx'];

const PARSE_STAGES = [
  'Detecting File...',
  'Extracting Content...',
  'Understanding Project...',
] as const;

export function UploadPage() {
  const navigate = useNavigate();
  const notify = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'idle' | 'parsing' | 'done' | 'error'>('idle');
  const [stageLabel, setStageLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const type = detectSourceType(f.name, f.type);
    if (!type) {
      setError('Unsupported file type. Please upload a README.md, PDF, DOCX, or TXT file.');
      notify('error', 'Unsupported file type');
      return;
    }
    setError(null);
    setFile(f);
    setStage('idle');
    setProgress(0);
  }, [notify]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const processFile = async () => {
    if (!file) return;
    setStage('parsing');
    setProgress(0);
    setError(null);

    try {
      setStageLabel(PARSE_STAGES[0]);
      setProgress(10);

      setStageLabel(PARSE_STAGES[1]);
      const parsed = await parseFile(file, (pct) => {
        setProgress(Math.min(pct, 70));
      });

      setStageLabel(PARSE_STAGES[2]);
      setProgress(75);
      notify('info', 'AI is analyzing your document...');

      const analysis = analyzeDocument(parsed.text);
      const health = scoreHealth(analysis);
      const optimizations = getAllAudienceOptimizations();
      setProgress(90);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be signed in.');

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: analysis.projectName,
          source_type: parsed.sourceType,
          source_filename: parsed.filename,
          raw_text: parsed.text,
          extracted_json: analysis,
          health_scores: health,
          audience_optimizations: optimizations,
        })
        .select()
        .single();

      if (error || !data) throw new Error(error?.message ?? 'Could not save project.');

      setProjectId(data.id);
      setProgress(100);
      setStage('done');
      notify('success', 'Analysis complete! Review the extracted information.');
    } catch (err) {
      setStage('error');
      const msg = err instanceof Error ? err.message : 'Something went wrong while processing your file.';
      setError(msg);
      notify('error', msg);
    }
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setStage('idle');
    setError(null);
    setProjectId(null);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Upload your documentation</h1>
          <p className="text-ink-muted">Drop in a README, PDF, DOCX, or TXT. Our AI will analyze it and extract your startup's story.</p>
        </div>

        {stage === 'done' && projectId ? (
          <Card className="p-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="font-display text-xl font-bold mb-2">Analysis complete!</h2>
            <p className="text-sm text-ink-muted mb-6">Your project has been analyzed and scored. Review the extracted information before generating your pitch deck.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate(`/review/${projectId}`)} size="lg" className="group">
                <Sparkles className="h-5 w-5" />
                Review & Continue
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button variant="secondary" size="lg" onClick={reset}>
                Upload another
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Drop zone */}
            <Card
              className={cn(
                'p-10 border-2 border-dashed transition-all duration-300',
                dragging ? 'border-violet-400/60 bg-violet-500/5 scale-[1.01]' : 'border-violet-500/20',
              )}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center justify-center text-center cursor-pointer py-8"
              >
                <div className={cn(
                  'h-16 w-16 rounded-2xl flex items-center justify-center mb-5 transition-all',
                  dragging ? 'bg-violet-500/20 scale-110' : 'bg-violet-500/10',
                )}>
                  <UploadCloud className={cn('h-8 w-8 text-violet-400 transition-transform', dragging && 'scale-110')} />
                </div>
                <h3 className="font-semibold text-ink mb-1.5">
                  {dragging ? 'Drop your file here' : 'Drag and drop your file'}
                </h3>
                <p className="text-sm text-ink-muted mb-4">or click to browse</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {(['README', 'PDF', 'DOCX', 'TXT'] as const).map((t) => (
                    <Badge key={t} variant={t === 'README' ? 'accent' : 'default'}>{t}</Badge>
                  ))}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED_EXTS.join(',')}
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            </Card>

            {/* Selected file */}
            {file && stage !== 'done' && (
              <Card className="p-5 mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-violet-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{file.name}</p>
                    <p className="text-xs text-ink-dim">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  {stage === 'idle' && (
                    <button onClick={reset} className="text-ink-dim hover:text-ink transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                {stage === 'parsing' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400" />
                        {stageLabel}
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 mb-4">
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-300">{error}</p>
                  </div>
                )}

                {stage === 'idle' && (
                  <Button onClick={processFile} className="w-full" size="lg">
                    <Sparkles className="h-5 w-5" />
                    Analyze with AI
                  </Button>
                )}
              </Card>
            )}

            {/* Supported formats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                { ext: 'README.md', icon: FileText, desc: 'Markdown preferred', recommended: true },
                { ext: 'PDF', icon: File, desc: 'Text-based PDFs', recommended: false },
                { ext: 'DOCX', icon: File, desc: 'Word documents', recommended: false },
                { ext: 'TXT', icon: FileText, desc: 'Plain text', recommended: false },
              ] as const).map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.ext} className={cn('glass rounded-xl p-3 text-center relative', f.recommended && 'border-violet-500/30')}>
                    {f.recommended && (
                      <span className="absolute -top-2 right-2 text-[9px] font-bold text-violet-300 bg-violet-500/20 px-1.5 py-0.5 rounded-full">
                        BEST
                      </span>
                    )}
                    <Icon className="h-5 w-5 text-violet-400 mx-auto mb-1.5" />
                    <div className="text-xs font-medium text-ink">{f.ext}</div>
                    <div className="text-[10px] text-ink-dim">{f.desc}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
