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

/** Full victory fanfare (~2.5 s) using Web Audio API — no files needed. */
function playVictoryFanfare() {
  try {
    const AudioCtx = window.AudioContext || window['webkitAudioContext'];
    const ctx = new AudioCtx();

    // [freq (Hz), start (s), duration (s)]
    // Retro RPG victory fanfare: intro run → held chord → triumphant finish
    const score = [
      // quick ascending run
      [392.00, 0.00, 0.09],  // G4
      [523.25, 0.10, 0.09],  // C5
      [659.25, 0.20, 0.09],  // E5
      [783.99, 0.30, 0.09],  // G5
      // short pause then punchy chords
      [523.25, 0.48, 0.12],  // C5
      [659.25, 0.48, 0.12],  // E5 (harmony)
      [783.99, 0.62, 0.12],  // G5
      [1046.5, 0.62, 0.12],  // C6 (harmony)
      // triumphant ascending finish
      [783.99, 0.82, 0.10],  // G5
      [880.00, 0.94, 0.10],  // A5
      [987.77, 1.06, 0.10],  // B5
      [1046.5, 1.18, 0.22],  // C6
      // final big chord held
      [523.25, 1.48, 0.55],  // C5
      [659.25, 1.48, 0.55],  // E5
      [783.99, 1.48, 0.55],  // G5
      [1046.5, 1.48, 0.55],  // C6
    ];

    score.forEach(([freq, t, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + t;
      gain.gain.setValueAtTime(0.13, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    });
  } catch {
    // audio not supported — fail silently
  }
}

function ScreenTimeBar({ hours = 2, onBarFull }) {
  const target = Math.round(Math.min(Math.max(hours, 0), 5) * 2); // 0–10
  const [filled, setFilled] = useState(0);
  const [fanfarePlayed, setFanfarePlayed] = useState(false);

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

  // Fire fanfare + notify parent exactly once when bar finishes filling
  useEffect(() => {
    if (filled >= target && target > 0 && !fanfarePlayed) {
      setFanfarePlayed(true);
      playVictoryFanfare();
      onBarFull?.();
    }
  }, [filled, target, fanfarePlayed, onBarFull]);

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
        <div style={{ flexShrink: 0, filter: 'drop-shadow(0 0 5px var(--yellow))' }}>
          <Zap size={34} color="var(--yellow)" fill="var(--yellow)" />
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          gap: 3,
          padding: 4,
          background: '#111',
          border: '2px solid #111',
          boxShadow: '2px 2px 0 #000',
        }}>
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

      {/* Stats row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
          REAL-WORLD TIME TODAY
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
  const [showThankYou, setShowThankYou] = useState(false);

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
        @keyframes popIn {
          0%  { opacity: 0; transform: scale(0.85); }
          65% { transform: scale(1.04); }
          100%{ opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
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

        {/* Screen time progress bar — triggers thank-you popup when full */}
        <ScreenTimeBar hours={hours} onBarFull={() => setShowThankYou(true)} />

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

      {/* Full-screen thank-you modal — click anywhere to dismiss */}
      {showThankYou && (
        <div
          onClick={() => setShowThankYou(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px',
            animation: 'fadeInBackdrop 0.25s ease forwards',
            cursor: 'pointer',
          }}
        >
          <div style={{
            background: 'var(--bg)',
            border: '4px solid var(--green)',
            boxShadow: '6px 6px 0 var(--green), 0 0 40px rgba(74,222,128,0.25)',
            padding: '32px 28px',
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
          }}>
            {/* Pulsing stars */}
            <div style={{ display: 'flex', gap: 12, animation: 'pulse 1.8s ease-in-out infinite' }}>
              <Star size={20} color="var(--yellow)" fill="var(--yellow)" />
              <Star size={26} color="var(--yellow)" fill="var(--yellow)" />
              <Star size={20} color="var(--yellow)" fill="var(--yellow)" />
            </div>

            <p style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(14px, 4vw, 20px)',
              color: 'var(--green)',
              margin: 0,
              lineHeight: 1.5,
              textShadow: '3px 3px 0 rgba(0,0,0,0.4)',
            }}>
              THANK YOU,<br />HERO!
            </p>

            <p style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: 'var(--text)',
              margin: 0,
              lineHeight: 2.1,
              wordBreak: 'break-word',
            }}>
              Every hour you spend outside instead of on a screen helps fight the teen screen time crisis. You made a real difference today. Keep questing!
            </p>

            {/* Pulsing zaps */}
            <div style={{ display: 'flex', gap: 12, animation: 'pulse 1.8s ease-in-out infinite' }}>
              <Zap size={18} color="var(--yellow)" fill="var(--yellow)" />
              <Zap size={18} color="var(--yellow)" fill="var(--yellow)" />
              <Zap size={18} color="var(--yellow)" fill="var(--yellow)" />
            </div>

            <p style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: 'var(--muted)',
              margin: 0,
            }}>
              TAP ANYWHERE TO CLOSE
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
