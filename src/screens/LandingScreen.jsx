import { useState, useEffect } from 'react';
import { Swords, Compass, Map, Flag, Star, Flame, Play } from 'lucide-react';
import Stars from '../components/Stars';
import ThemeToggle from '../components/ThemeToggle';
import PixelBtn from '../components/PixelBtn';

const decorIcons = [Swords, Compass, Map, Flag, Star, Flame];

const coinFrames = ['▼ INSERT COIN ▼', '▽ INSERT COIN ▽'];

export default function LandingScreen({ onPlay }) {
  const [coinFrame, setCoinFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCoinFrame(f => (f + 1) % coinFrames.length), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg)',
        padding: '24px 16px',
      }}
    >
      <style>{`
        @keyframes flicker {
          0%,95%,100%{opacity:1}
          96%{opacity:0.6}
          97%{opacity:1}
          98%{opacity:0.4}
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Stars />
      <ThemeToggle />

      {/* Decorative icon row */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-evenly',
          opacity: 0.25,
          zIndex: 1,
        }}
      >
        {decorIcons.map((Icon, i) => (
          <Icon key={i} size={20} color="var(--yellow)" />
        ))}
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Spinning compass */}
        <div
          style={{
            animation: 'spin 8s linear infinite',
            filter: 'drop-shadow(0 0 12px var(--yellow))',
          }}
        >
          <Compass size={52} color="var(--yellow)" />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(42px, 10vw, 74px)',
            color: 'var(--yellow)',
            textShadow: '4px 4px 0 var(--red), 8px 8px 0 rgba(0,0,0,0.5)',
            margin: 0,
            animation: 'flicker 4s infinite',
            lineHeight: 1.1,
          }}
        >
          QUEST
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(9px, 2vw, 11px)',
            color: 'var(--purple)',
            fontStyle: 'italic',
            textShadow: '0 0 8px var(--purple)',
            margin: 0,
          }}
        >
          ~ your boredom slayer ~
        </p>

        {/* Play button */}
        <PixelBtn
          color="var(--yellow)"
          onClick={onPlay}
          style={{ fontSize: 15, padding: '16px 52px' }}
        >
          <Play size={16} fill="var(--bg)" />
          PLAY
        </PixelBtn>

        {/* Insert coin */}
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            color: 'var(--yellow)',
            opacity: 0.4,
            margin: 0,
          }}
        >
          {coinFrames[coinFrame]}
        </p>

        {/* Footer */}
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'var(--text)',
            opacity: 0.25,
            margin: 0,
          }}
        >
          © 2026 QUEST STUDIOS • 1 PLAYER
        </p>
      </div>
    </div>
  );
}
