import { useState, useEffect } from 'react';
import { Zap, Star, Map, Play } from 'lucide-react';
import Stars from '../components/Stars';
import ThemeToggle from '../components/ThemeToggle';
import PixelBox from '../components/PixelBox';
import PixelBtn from '../components/PixelBtn';
import PixelAvatar from '../components/PixelAvatar';
import Confetti from '../components/Confetti';

// 10 square segments — each represents 0.5h, so 5h max = all filled
const TOTAL_SEGMENTS = 10;

function ScreenTimeBar({ hours = 2 }) {
  const target = Math.round(Math.min(Math.max(hours, 0), 5) * 2); // 0–10
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = setTimeout(() => {
      let n = 0;
      const id = setInterval(() => {
        n += 1;
        setFilled(n);
        if (n >= target) clearInterval(id);
      }, 160);
      return () => clearInterval(id);
    }, 700);
    return () => clearTimeout(start);
  }, [target]);

  const done = filled >= target && target > 0;

  return (
    <PixelBox color="var(--yellow)" style={{ width: '100%', textAlign: 'left' }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Zap size={12} color="var(--yellow)" fill="var(--yellow)" />
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'var(--yellow)', margin: 0 }}>
          SCREEN TIME SLAIN
        </p>
      </div>

      {/* Lightning bolt + pixel block bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Bold lightning bolt */}
        <div style={{ flexShrink: 0, filter: 'drop-shadow(0 0 5px var(--yellow))' }}>
          <Zap size={34} color="var(--yellow)" fill="var(--yellow)" />
        </div>

        {/* Pixel bar: thick dark outer border, small gaps between square blocks */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'stretch',
            gap: 3,
            padding: 4,
            background: '#111',
            border: '2px solid #111',
            boxShadow: '2px 2px 0 #000',
          }}
        >
          {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 28,
                background: i < filled ? 'var(--yellow)' : 'var(--bg2)',
                boxShadow: i < filled
                  ? 'inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.35)'
                  : 'none',
                transition: 'background 0.08s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats + message */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
          {done ? 'EVERY HOUR OUTSIDE COUNTS!' : 'REAL-WORLD TIME TODAY'}
        </p>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: done ? 'var(--green)' : 'var(--yellow)', margin: 0, flexShrink: 0, marginLeft: 8 }}>
          {(filled / 2).toFixed(1)}/{5}H
        </p>
      </div>
    </PixelBox>
  );
}

export default function CompleteScreen({ onRestart, avatar, hours = 2 }) {
  const [blinkOn, setBlinkOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setBlinkOn(v => !v), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleKey = () => onRestart();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onRestart]);

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
        @keyframes bob {
          from { transform: translateY(0); }
          to   { transform: translateY(-6px); }
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

        {/* Avatar between title and rewards */}
        {avatar && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <Star size={20} color="var(--yellow)" fill="var(--yellow)" />
            <div
              style={{
                animation: 'bob 0.8s ease-in-out infinite alternate',
                filter: `drop-shadow(0 0 12px ${avatar.color})`,
              }}
            >
              <PixelAvatar grid={avatar.grid} pixelSize={7} />
            </div>
            <Star size={20} color="var(--yellow)" fill="var(--yellow)" />
          </div>
        )}

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

        {/* Screen time sword progress bar */}
        <ScreenTimeBar hours={hours} />

        {/* Hero of the day box */}
        {avatar && (
          <PixelBox color={avatar.color} style={{ width: '100%' }}>
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: avatar.color,
                margin: '0 0 8px',
              }}
            >
              HERO OF THE DAY
            </p>
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: 'var(--text)',
                margin: 0,
                wordBreak: 'break-word',
                lineHeight: 1.7,
              }}
            >
              {avatar.name} — {avatar.desc}
            </p>
          </PixelBox>
        )}

        <PixelBtn
          color="var(--yellow)"
          onClick={onRestart}
          style={{ fontSize: 12, padding: '14px 40px' }}
        >
          <Play size={14} fill="var(--bg)" />
          PLAY AGAIN
        </PixelBtn>

        <p
          onClick={onRestart}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'var(--muted)',
            margin: 0,
            opacity: blinkOn ? 1 : 0,
            transition: 'opacity 0.1s',
            cursor: 'pointer',
          }}
        >
          PRESS ANY KEY TO CONTINUE
        </p>
      </div>
    </div>
  );
}
