export default function PixelBox({ color = '#f5c842', glow = false, onClick, style, children, className }) {
  const shadow = glow
    ? `inset 0 0 12px ${color}55, 0 0 16px ${color}44`
    : `4px 4px 0 ${color}`;

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        position: 'relative',
        background: 'var(--bg)',
        border: `4px solid ${color}`,
        boxShadow: shadow,
        padding: '16px',
        ...style,
      }}
    >
      {/* Corner squares */}
      {[
        { top: -4, left: -4 },
        { top: -4, right: -4 },
        { bottom: -4, left: -4 },
        { bottom: -4, right: -4 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 6,
            height: 6,
            background: color,
            ...pos,
          }}
        />
      ))}
      {children}
    </div>
  );
}
