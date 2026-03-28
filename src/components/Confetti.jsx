const colors = ['#f5c842', '#e8534a', '#4ade80', '#60a5fa', '#c084fc', '#f97316'];

export default function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    left: `${(i * 43 + 5) % 98}%`,
    color: colors[i % colors.length],
    size: 8 + (i % 4) * 3,
    isCircle: i % 2 === 0,
    duration: 2 + (i % 4) * 0.5,
    delay: (i % 8) * 0.15,
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes cfetti {
          to { transform: translateY(110vh) rotate(540deg); opacity: 0; }
        }
      `}</style>
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.isCircle ? '50%' : '1px',
            animation: `cfetti ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
