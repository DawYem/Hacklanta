import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Stars from '../components/Stars';
import PixelBox from '../components/PixelBox';
import PixelBtn from '../components/PixelBtn';
import PixelAvatar from '../components/PixelAvatar';
import { avatars } from '../data/avatars';

export default function AvatarScreen({ onBack, onConfirm }) {
  const [selectedId, setSelectedId] = useState(null);

  const selected = avatars.find(a => a.id === selectedId) || null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes flicker {
          0%,95%,100%{opacity:1}
          96%{opacity:0.6}
          97%{opacity:1}
          98%{opacity:0.4}
        }
      `}</style>
      <Stars />

      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
          padding: '24px 16px 40px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text)',
              padding: 4,
              display: 'flex',
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                color: 'var(--yellow)',
                margin: '0 0 6px',
                letterSpacing: '0.1em',
              }}
            >
              P1 SELECT
            </p>
            <h2
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 18,
                color: 'var(--text)',
                margin: 0,
              }}
            >
              CHOOSE HERO
            </h2>
          </div>
          {/* spacer to balance the back button */}
          <div style={{ width: 28 }} />
        </div>

        {/* Avatar 2×2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 28,
          }}
        >
          {avatars.map(avatar => {
            const isSelected = selectedId === avatar.id;
            return (
              <PixelBox
                key={avatar.id}
                color={isSelected ? avatar.color : 'var(--bg2)'}
                glow={isSelected}
                onClick={() => setSelectedId(avatar.id)}
                style={{ cursor: 'pointer', padding: '12px 8px 10px', textAlign: 'center' }}
              >
                {/* Badge */}
                <div
                  style={{
                    display: 'inline-block',
                    background: isSelected ? avatar.color : 'transparent',
                    padding: '3px 6px',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 6,
                      color: isSelected ? 'var(--bg)' : 'var(--muted)',
                    }}
                  >
                    {isSelected ? '► SELECTED' : `── ${avatar.id} ──`}
                  </span>
                </div>

                {/* Avatar sprite */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 10,
                    filter: isSelected
                      ? `drop-shadow(0 0 6px ${avatar.color})`
                      : 'grayscale(0.6) brightness(0.6)',
                    transition: 'filter 0.2s',
                  }}
                >
                  <PixelAvatar grid={avatar.grid} pixelSize={6} />
                </div>

                {/* Name */}
                <p
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color: 'var(--text)',
                    margin: '0 0 4px',
                    wordBreak: 'break-word',
                    lineHeight: 1.5,
                  }}
                >
                  {avatar.name}
                </p>

                {/* Desc */}
                <p
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: 'var(--muted)',
                    margin: '0 0 10px',
                    wordBreak: 'break-word',
                    lineHeight: 1.6,
                  }}
                >
                  {avatar.desc}
                </p>

                {/* Level bar */}
                <div
                  style={{
                    height: 4,
                    background: 'var(--bg2)',
                    border: `1px solid ${isSelected ? avatar.color : 'var(--bg2)'}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: isSelected ? '100%' : '40%',
                      background: isSelected ? avatar.color : 'var(--muted)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </PixelBox>
            );
          })}
        </div>

        {/* Confirm button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <PixelBtn
            color="var(--yellow)"
            onClick={selected ? () => onConfirm(selected) : undefined}
            disabled={!selected}
            style={{ fontSize: 11, padding: '14px 32px' }}
          >
            <CheckCircle size={14} />
            CONFIRM HERO
          </PixelBtn>

          {/* Selected feedback */}
          {selected && (
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: selected.color,
                margin: 0,
                animation: 'flicker 2s infinite',
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              {selected.name} READY FOR BATTLE!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
