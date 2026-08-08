import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Upload,
  ShieldCheck,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'New Pitch', icon: Upload },
  { to: '/verify', label: 'Verify', icon: ShieldCheck },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-violet-500/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/40 blur-lg group-hover:bg-violet-500/60 transition-colors" />
              <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-ink text-lg tracking-tight">
                PitchForge<span className="text-violet-400"> AI</span>
              </span>
              <span className="text-[10px] text-ink-dim tracking-wide">One README. Every Audience.</span>
            </div>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
                      active
                        ? 'text-ink bg-violet-500/15 border border-violet-400/20'
                        : 'text-ink-muted hover:text-ink hover:bg-white/5 border border-transparent',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2.5 pr-3 pl-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-semibold text-white">
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-ink-muted max-w-[160px] truncate">{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:inline-flex">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
                <button
                  className="md:hidden text-ink-muted hover:text-ink p-2"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Menu"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {user && mobileOpen && (
          <div className="md:hidden border-t border-violet-500/10 px-4 py-3 flex flex-col gap-1 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium',
                    active ? 'text-ink bg-violet-500/15' : 'text-ink-muted',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
