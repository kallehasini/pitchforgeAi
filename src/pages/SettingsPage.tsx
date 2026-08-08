import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils';
import {
  User,
  Palette,
  Key,
  LogOut,
  Moon,
  Sparkles,
  Check,
  Mail,
} from 'lucide-react';

type SettingsTab = 'profile' | 'theme' | 'api';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const notify = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<SettingsTab>('profile');
  const [apiKey, setApiKey] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
        <p className="text-ink-muted mb-8">Manage your profile, appearance, and API configuration.</p>

        <div className="grid sm:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-1.5">
            {([
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'theme', label: 'Theme', icon: Palette },
              { id: 'api', label: 'API Keys', icon: Key },
            ] as const).map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                    tab === t.id ? 'text-ink bg-violet-500/15 border border-violet-400/20' : 'text-ink-muted hover:text-ink hover:bg-white/5',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all mt-4"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          {/* Content */}
          <div className="sm:col-span-2">
            {tab === 'profile' && (
              <Card className="p-6">
                <h3 className="font-semibold text-ink mb-5 flex items-center gap-2">
                  <User className="h-5 w-5 text-violet-400" />
                  Profile
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-violet-500/20">
                      {user?.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-ink">{user?.email}</p>
                      <p className="text-xs text-ink-dim mt-0.5">Member since {new Date().getFullYear()}</p>
                    </div>
                  </div>
                  <Input
                    label="Email"
                    value={user?.email ?? ''}
                    icon={<Mail className="h-4 w-4" />}
                    disabled
                  />
                  <div className="flex items-center gap-2">
                    <Badge variant="success"><Check className="h-3 w-3" /> Active</Badge>
                    <Badge variant="accent">Free plan</Badge>
                  </div>
                </div>
              </Card>
            )}

            {tab === 'theme' && (
              <Card className="p-6">
                <h3 className="font-semibold text-ink mb-5 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-violet-400" />
                  Appearance
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { id: 'dark', label: 'Dark', desc: 'Default purple accent', colors: 'from-violet-500 to-fuchsia-500' },
                    { id: 'midnight', label: 'Midnight', desc: 'Deeper, cooler tones', colors: 'from-indigo-500 to-violet-600' },
                  ] as const).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        'text-left p-4 rounded-xl border transition-all',
                        theme === t.id ? 'border-violet-400/50 bg-violet-500/10 shadow-glow' : 'border-white/10 bg-white/5 hover:border-violet-400/30',
                      )}
                    >
                      <div className={cn('h-10 w-10 rounded-lg bg-gradient-to-br mb-3', t.colors)} />
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-ink-muted" />
                        <span className="font-medium text-ink text-sm">{t.label}</span>
                        {theme === t.id && <Check className="h-4 w-4 text-violet-400 ml-auto" />}
                      </div>
                      <p className="text-xs text-ink-dim mt-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {tab === 'api' && (
              <Card className="p-6">
                <h3 className="font-semibold text-ink mb-2 flex items-center gap-2">
                  <Key className="h-5 w-5 text-violet-400" />
                  API Keys
                </h3>
                <p className="text-sm text-ink-muted mb-5">
                  Optional. PitchForge uses a built-in AI engine by default. Add a Gemini or OpenAI key to enable live AI generation.
                </p>
                <div className="space-y-4">
                  <Input
                    label="Gemini API Key"
                    type="password"
                    placeholder="AIza…"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={() => notify('success', 'API key saved (demo).')} disabled={!apiKey}>
                      Save key
                    </Button>
                    <Badge variant="warning">Optional</Badge>
                  </div>
                  <div className="rounded-lg bg-violet-500/5 border border-violet-500/15 p-3">
                    <p className="text-xs text-ink-muted flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                      The built-in AI engine works without any keys. This is for production deployments only.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
