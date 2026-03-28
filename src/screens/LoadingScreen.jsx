import { useState, useEffect } from 'react';
import { Compass, Wind, Map, Swords, Flag } from 'lucide-react';
import Stars from '../components/Stars';
import PixelBox from '../components/PixelBox';
import PixelBtn from '../components/PixelBtn';
import PixelAvatar from '../components/PixelAvatar';

const steps = [
  { Icon: Wind, label: 'SCANNING WEATHER...' },
  { Icon: Map, label: 'SCOUTING LOCATIONS...' },
  { Icon: Swords, label: 'FORGING CHALLENGES...' },
  { Icon: Flag, label: 'QUEST READY!' },
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function LoadingScreen({ onBack, onDone, onGenerateQuest, avatar }) {
  const [activeStep, setActiveStep] = useState(0);
  const [dots, setDots] = useState('...');
  const [error, setError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

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

    return () => {
      clearInterval(dotId);
      clearInterval(stepId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function runQuestLoad() {
      try {
        setError('');
        const [quest] = await Promise.all([onGenerateQuest(), delay(3200)]);

        if (!cancelled) {
          onDone(quest);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to generate quest.');
        }
      } finally {
        if (!cancelled) {
          setIsRetrying(false);
        }
      }
    }

    runQuestLoad();

    return () => {
      cancelled = true;
    };
  }, [onDone, onGenerateQuest, isRetrying]);

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
            BUILDING YOUR QUEST
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

        {error ? (
          <PixelBox color="var(--red)" style={{ width: '100%' }}>
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: 'var(--red)',
                margin: '0 0 10px',
                lineHeight: 1.8,
              }}
            >
              {error}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <PixelBtn
                color="var(--red)"
                onClick={() => setIsRetrying(value => !value)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                RETRY
              </PixelBtn>
              <PixelBtn
                color="var(--blue)"
                onClick={onBack}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                BACK
              </PixelBtn>
            </div>
          </PixelBox>
        ) : null}
      </div>
    </div>
  );
}
