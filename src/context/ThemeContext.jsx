import { createContext, useContext, useState, useEffect } from 'react';
import { tokens } from '../styles/tokens';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('quest-theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('quest-theme', theme);
    const t = tokens[theme];
    Object.entries(t).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val);
    });
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
