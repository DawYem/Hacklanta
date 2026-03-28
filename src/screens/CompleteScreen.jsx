import { useState, useEffect } from 'react';
import { Trophy, Zap, Star, Map, Play } from 'lucide-react';
import Stars from '../components/Stars';
import ThemeToggle from '../components/ThemeToggle';
import PixelBox from '../components/PixelBox';
import PixelBtn from '../components/PixelBtn';
import Confetti from '../components/Confetti';

export default function CompleteScreen({ onRestart }) {
  const [blinkOn, setBlinkOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setBlinkOn(v => !v), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
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
      `}</style>
      <Stars />
      <Confetti />
      <ThemeToggle />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(26px, 8vw, 46px)',
            color: 'var(--yellow)',
            textShadow: '4px 4px 0 var(--red)',
            margin: 0,
            animation: 'flicker 3s infinite',
            lineHeight: 1.2,
          }}
        >
          QUEST<br />COMPLETE!
        </h1>

        <div style={{ filter: 'drop-shadow(0 0 20px var(--yellow))' }}>
          <Trophy size={64} color="var(--yellow)" fill="var(--yellow)" />
        </div>

        <PixelBox color="var(--green)" style={{ width: '100%' }}>
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: 'var(--green)',
              margin: '0 0 12px',
            }}
          >
            REWARDS EARNED
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <Zap size={16} color="var(--yellow)" fill="var(--yellow)" />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 14,
                color: 'var(--yellow)',
              }}
            >
              +420 XP
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {[0, 1, 2].map(i => (
              <Star key={i} size={20} color="var(--yellow)" fill="var(--yellow)" />
            ))}
          </div>
        </PixelBox>

        <PixelBox color="var(--purple)" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Map size={14} color="var(--purple)" />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: 'var(--purple)',
              }}
            >
              ACHIEVEMENT UNLOCKED
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--text)',
              margin: 0,
            }}
          >
            URBAN EXPLORER I
          </p>
        </PixelBox>

        <PixelBtn
          color="var(--yellow)"
          onClick={onRestart}
          style={{ fontSize: 12, padding: '14px 40px' }}
        >
          <Play size={14} fill="var(--bg)" />
          PLAY AGAIN
        </PixelBtn>

        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'var(--muted)',
            margin: 0,
            opacity: blinkOn ? 1 : 0,
            transition: 'opacity 0.1s',
          }}
        >
          PRESS ANY KEY TO CONTINUE
        </p>
      </div>
    </div>
  );
}
