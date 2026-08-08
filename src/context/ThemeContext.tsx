import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'midnight';
interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'pitchforge-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved) setThemeState(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    const root = document.documentElement;
    if (theme === 'midnight') {
      root.style.setProperty('--color-bg', '#050410');
      root.style.setProperty('--color-surface', '#0c0a1a');
      root.style.setProperty('--color-surface-2', '#13103a');
    } else {
      root.style.setProperty('--color-bg', '#07060d');
      root.style.setProperty('--color-surface', '#0f0d1c');
      root.style.setProperty('--color-surface-2', '#161331');
    }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
