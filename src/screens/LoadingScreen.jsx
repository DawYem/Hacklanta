import { useState, useEffect } from 'react';
import { Compass, Wind, Map, Swords, Flag } from 'lucide-react';
import Stars from '../components/Stars';
import PixelBox from '../components/PixelBox';
import PixelAvatar from '../components/PixelAvatar';

const steps = [
  { Icon: Wind, label: 'SCANNING WEATHER...' },
  { Icon: Map, label: 'SCOUTING LOCATIONS...' },
  { Icon: Swords, label: 'FORGING CHALLENGES...' },
  { Icon: Flag, label: 'QUEST READY!' },
];

export default function LoadingScreen({ onDone, avatar }) {
  const [activeStep, setActiveStep] = useState(0);
  const [dots, setDots] = useState('...');

  useEffect(() => {
    const dotId = setInterval(() => {
      setDots(d => (d.length >= 3 ? '.' : d + '.'));
    }, 400);

    let step = 0;
    const stepId = setInterval(() => {
      step++;
      setActiveStep(step);
      if (step >= steps.length) {
        clearInterval(stepId);
      }
    }, 750);

    const doneId = setTimeout(onDone, 3200);

    return () => {
      clearInterval(dotId);
      clearInterval(stepId);
      clearTimeout(doneId);
    };
  }, [onDone]);

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
        padding: 24,
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bob {
          from { transform: translateY(0); }
          to   { transform: translateY(-6px); }
        }
      `}</style>
      <Stars />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          maxWidth: 400,
          width: '100%',
        }}
      >
        {/* Compass + avatar side by side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              animation: 'spin 2s linear infinite',
              filter: 'drop-shadow(0 0 12px var(--yellow))',
            }}
          >
            <Compass size={56} color="var(--yellow)" />
          </div>
          {avatar && (
            <div
              style={{
                animation: 'bob 0.8s ease-in-out infinite alternate',
                filter: `drop-shadow(0 0 8px ${avatar.color})`,
              }}
            >
              <PixelAvatar grid={avatar.grid} pixelSize={5} />
            </div>
          )}
        </div>

        <PixelBox color="var(--yellow)" style={{ width: '100%', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--yellow)',
              margin: '0 0 4px',
            }}
          >
            GEMINI IS THINKING
          </p>
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 14,
              color: 'var(--yellow)',
              margin: 0,
              letterSpacing: '0.2em',
            }}
          >
            {dots}
          </p>
        </PixelBox>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {steps.map((s, i) => {
            const isDone = i < activeStep;
            const isCurrent = i === activeStep;
            const color = isDone ? 'var(--green)' : isCurrent ? 'var(--yellow)' : '#444';

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: isCurrent || isDone ? 1 : 0.2,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <s.Icon size={18} color={color} />
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color,
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
