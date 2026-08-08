import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthShell } from '@/components/auth/AuthShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const notify = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      notify('error', error);
      return;
    }
    setSent(true);
    notify('success', 'Reset link sent. Check your email.');
  };

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a secure reset link.">
      {sent ? (
        <div className="text-center py-6">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-ink mb-1.5">Check your inbox</h3>
          <p className="text-sm text-ink-muted mb-6">
            We sent a reset link to <span className="text-ink font-medium">{email}</span>.
          </p>
          <Link to="/login">
            <Button variant="secondary" className="w-full">
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
        </div>
      ) : (
        <>
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
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Send reset link
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-ink-muted">
            Remembered your password?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
