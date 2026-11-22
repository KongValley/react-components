import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

function readInitialTheme(): Theme {
  if (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark') {
    return 'dark';
  }
  return 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem('rcui-docs-theme', theme);
    } catch {
      // storage may be unavailable
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggleTheme };
}
