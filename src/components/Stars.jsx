import { useTheme } from '../context/theme-context';

export default function Stars() {
  const { theme } = useTheme();

  const stars = Array.from({ length: 40 }, (_, i) => ({
    left: `${(i * 37 + 11) % 97}%`,
    top: `${(i * 53 + 7) % 95}%`,
    size: i % 5 === 0 ? 3 : 2,
    opacity: 0.4 + (i % 6) * 0.09,
    duration: 2 + (i % 5) * 0.4,
    delay: (i % 7) * 0.3,
  }));

  if (theme === 'light') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--star-op); }
          50% { opacity: 0.1; }
        }
      `}</style>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: '#fff',
            borderRadius: '50%',
            '--star-op': s.opacity,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
