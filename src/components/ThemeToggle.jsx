import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PixelBtn from './PixelBtn';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
      <PixelBtn
        color="var(--yellow)"
        onClick={toggle}
        style={{ fontSize: 9, padding: '8px 10px' }}
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </PixelBtn>
    </div>
  );
}
