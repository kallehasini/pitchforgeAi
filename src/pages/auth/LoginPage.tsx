import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthShell } from '@/components/auth/AuthShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const notify = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      notify('error', error);
      return;
    }
    notify('success', 'Welcome back!');
    navigate('/dashboard');
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue forging pitches.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@startup.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink-muted cursor-pointer">
            <input type="checkbox" className="rounded border-violet-500/30 bg-surface-2 text-violet-500 focus:ring-violet-500/20" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-violet-400 hover:text-violet-300 transition-colors">
            Forgot password?
          </Link>
        </div>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium">
          Sign up free
        </Link>
      </p>
    </AuthShell>
  );
}
