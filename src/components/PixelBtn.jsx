import { useState, useEffect } from 'react';

export default function PixelBtn({
  color = '#f5c842',
  onClick,
  disabled = false,
  blink = false,
  style,
  children,
}) {
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!blink) return;
    const id = setInterval(() => setVisible(v => !v), 600);
    return () => clearInterval(id);
  }, [blink]);

  return (
    <button
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={disabled ? undefined : onClick}
      style={{
        background: color,
        color: 'var(--bg)',
        border: 'none',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 14,
        padding: '12px 24px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
        transform: pressed ? 'translate(2px,2px)' : 'none',
        opacity: disabled ? 0.5 : blink ? (visible ? 1 : 0.2) : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        transition: 'opacity 0.1s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
