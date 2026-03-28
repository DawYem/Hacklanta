import { useState } from 'react';
import { ArrowLeft, ChevronRight, Timer, MapPin, Swords } from 'lucide-react';
import Stars from '../components/Stars';
import ThemeToggle from '../components/ThemeToggle';
import PixelBox from '../components/PixelBox';
import PixelBtn from '../components/PixelBtn';
import { vibes } from '../data/mockQuest';

function ProgressBar({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--bg2)', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: step === 1 ? '50%' : '100%',
            background: 'var(--yellow)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: 'var(--yellow)',
          whiteSpace: 'nowrap',
        }}
      >
        {step}/2
      </span>
    </div>
  );
}

export default function VibeScreen({ onBack, onComplete, initialVibe, initialTime, initialLocation }) {
  const [step, setStep] = useState(1);
  const [selectedVibe, setSelectedVibe] = useState(initialVibe || null);
  const [time, setTime] = useState(initialTime || 2);
  const [location, setLocation] = useState(initialLocation || '');

  const handleNext = () => {
    if (step === 1 && selectedVibe) setStep(2);
    else if (step === 2 && location.trim()) {
      onComplete({ vibe: selectedVibe, time, location });
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else onBack();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Stars />
      <ThemeToggle />

      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
          padding: '24px 16px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button
            onClick={handleBack}
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
          <div style={{ flex: 1 }}>
            <ProgressBar step={step} />
          </div>
        </div>

        {step === 1 && (
          <>
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  color: 'var(--yellow)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  margin: '0 0 8px',
                }}
              >
                SELECT YOUR
              </p>
              <h2
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 22,
                  color: 'var(--text)',
                  textShadow: '2px 2px 0 var(--purple)',
                  margin: 0,
                }}
              >
                VIBE
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 32,
              }}
            >
              {vibes.map(vibe => {
                const isSelected = selectedVibe === vibe.id;
                return (
                  <PixelBox
                    key={vibe.id}
                    color={isSelected ? vibe.color : '#2a2a3e'}
                    glow={isSelected}
                    onClick={() => setSelectedVibe(vibe.id)}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: '16px 8px',
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    <vibe.Icon
                      size={32}
                      color={isSelected ? vibe.color : '#555'}
                      style={{
                        filter: isSelected ? `drop-shadow(0 0 6px ${vibe.color})` : 'none',
                        marginBottom: 8,
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 8,
                        color: 'var(--text)',
                        margin: '0 0 4px',
                      }}
                    >
                      {vibe.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 7,
                        color: 'var(--muted)',
                        margin: 0,
                      }}
                    >
                      {vibe.description}
                    </p>
                  </PixelBox>
                );
              })}
            </div>

            <PixelBtn
              color="var(--yellow)"
              onClick={() => setStep(2)}
              disabled={!selectedVibe}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              NEXT <ChevronRight size={14} />
            </PixelBtn>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  color: 'var(--yellow)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  margin: '0 0 8px',
                }}
              >
                SET YOUR
              </p>
              <h2
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 16,
                  color: 'var(--text)',
                  textShadow: '2px 2px 0 var(--purple)',
                  margin: 0,
                }}
              >
                MISSION PARAMS
              </h2>
            </div>

            {/* Time card */}
            <PixelBox color="var(--green)" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Timer size={16} color="var(--green)" />
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color: 'var(--green)',
                  }}
                >
                  TIME AVAILABLE
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={time}
                onChange={e => setTime(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--green)',
                  cursor: 'pointer',
                  marginBottom: 8,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[1, 2, 3, 4, 5].map(h => (
                  <span
                    key={h}
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: h <= time ? 'var(--green)' : 'var(--muted)',
                    }}
                  >
                    {h}H
                  </span>
                ))}
              </div>
            </PixelBox>

            {/* Location card */}
            <PixelBox color="var(--blue)" style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <MapPin size={16} color="var(--blue)" />
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color: 'var(--blue)',
                  }}
                >
                  YOUR LOCATION
                </span>
              </div>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Downtown Atlanta"
                style={{
                  width: '100%',
                  background: 'var(--bg)',
                  border: '2px solid var(--blue)',
                  color: 'var(--text)',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9,
                  padding: '10px 12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </PixelBox>

            <PixelBtn
              color="var(--red)"
              onClick={handleNext}
              disabled={!location.trim()}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Swords size={14} />
              START QUEST
            </PixelBtn>
          </>
        )}
      </div>
    </div>
  );
}
