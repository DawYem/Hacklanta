import { useState, useEffect } from 'react';
import { ArrowLeft, Map, CheckCircle, Lock, Flag, Trophy, TreePine } from 'lucide-react';
import Stars from '../components/Stars';
import ThemeToggle from '../components/ThemeToggle';
import PixelBox from '../components/PixelBox';
import PixelBtn from '../components/PixelBtn';

// Node positions as percentages [x, y]
const NODE_POSITIONS = [
  [50, 87],
  [22, 67],
  [70, 47],
  [28, 25],
];

const TREE_POSITIONS = [
  { left: '8%', top: '20%' },
  { left: '85%', top: '35%' },
  { left: '12%', top: '55%' },
  { left: '78%', top: '65%' },
  { left: '5%', top: '80%' },
  { left: '90%', top: '15%' },
];

export default function QuestMap({ stops: initialStops, onBack, onComplete }) {
  const [stops, setStops] = useState(
    initialStops.map(s => ({ ...s, completed: false }))
  );
  const [selected, setSelected] = useState(null);

  const completedCount = stops.filter(s => s.completed).length;
  const hpPercent = Math.round((completedCount / stops.length) * 100);
  const allDone = completedCount === stops.length;

  useEffect(() => {
    if (allDone) {
      const id = setTimeout(onComplete, 800);
      return () => clearTimeout(id);
    }
  }, [allDone, onComplete]);

  const firstIncompleteIdx = stops.findIndex(s => !s.completed);

  const toggleStop = id => {
    setStops(prev =>
      prev.map(s => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
    setSelected(null);
  };

  const handleNodeClick = (stop, idx) => {
    const isLocked = idx > firstIncompleteIdx && firstIncompleteIdx !== -1;
    if (isLocked) return;
    setSelected(selected === stop.id ? null : stop.id);
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
      <style>{`
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
      <Stars />

      {/* Green terrain gradient */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to top, rgba(34,85,34,0.15), transparent)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Scattered trees */}
      {TREE_POSITIONS.map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            ...pos,
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.3,
          }}
        >
          <TreePine size={22} color="var(--green)" />
        </div>
      ))}

      <ThemeToggle />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 480,
          margin: '0 auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
          <PixelBox
            color="var(--yellow)"
            style={{ flex: 1, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Map size={14} color="var(--yellow)" />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                color: 'var(--yellow)',
                flex: 1,
              }}
            >
              QUEST MAP
            </span>
            <CheckCircle size={12} color="var(--green)" />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: 'var(--green)',
              }}
            >
              {completedCount}/{stops.length}
            </span>
          </PixelBox>
        </div>

        {/* HP bar */}
        <div>
          <div style={{ height: 8, background: 'var(--bg2)', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${hpPercent}%`,
                background: 'var(--green)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: 'var(--green)',
            }}
          >
            {hpPercent}% COMPLETE
          </span>
        </div>
      </div>

      {/* Map area */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: 480,
          margin: '0 auto',
          padding: '0 16px',
          minHeight: 520,
        }}
      >
        {/* SVG paths */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Base dashed path */}
          <polyline
            points={NODE_POSITIONS.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />
          {/* Completed overlay */}
          {completedCount > 0 && (
            <polyline
              points={NODE_POSITIONS.slice(0, completedCount + 1)
                .map(([x, y]) => `${x},${y}`)
                .join(' ')}
              fill="none"
              stroke="var(--green)"
              strokeWidth="0.8"
              strokeOpacity="0.7"
            />
          )}
        </svg>

        {/* Start flag */}
        <div
          style={{
            position: 'absolute',
            left: `${NODE_POSITIONS[0][0]}%`,
            top: `${NODE_POSITIONS[0][1] + 6}%`,
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Flag size={14} fill="var(--yellow)" color="var(--yellow)" />
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 6,
              color: 'var(--yellow)',
            }}
          >
            START
          </span>
        </div>

        {/* Finish trophy */}
        <div
          style={{
            position: 'absolute',
            left: `${NODE_POSITIONS[NODE_POSITIONS.length - 1][0]}%`,
            top: `${NODE_POSITIONS[NODE_POSITIONS.length - 1][1] - 8}%`,
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            opacity: allDone ? 1 : 0.3,
            transition: 'opacity 0.5s ease',
          }}
        >
          <Trophy
            size={20}
            color="var(--yellow)"
            fill={allDone ? 'var(--yellow)' : 'none'}
          />
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 6,
              color: 'var(--yellow)',
            }}
          >
            FINISH
          </span>
        </div>

        {/* Stop nodes */}
        {stops.map((stop, idx) => {
          const [xPct, yPct] = NODE_POSITIONS[idx];
          const isLocked = idx > firstIncompleteIdx && firstIncompleteIdx !== -1;
          const isActive = idx === firstIncompleteIdx;
          const isDone = stop.completed;
          const isSelected = selected === stop.id;

          const nodeColor = isDone ? 'var(--green)' : isLocked ? 'var(--muted)' : stop.color;

          // Popup positioning
          const popupLeft = xPct > 50;
          const popupTop = yPct > 60;

          return (
            <div
              key={stop.id}
              style={{
                position: 'absolute',
                left: `${xPct}%`,
                top: `${yPct}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Ping ring for active node */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    inset: -6,
                    borderRadius: '50%',
                    border: `3px solid ${stop.color}`,
                    opacity: 0.6,
                    animation: 'ping 1.5s ease-in-out infinite',
                  }}
                />
              )}

              {/* Node circle */}
              <div
                onClick={() => handleNodeClick(stop, idx)}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: `4px solid ${nodeColor}`,
                  background: isDone ? '#0d1f0d' : isLocked ? '#111' : 'var(--bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  filter: isLocked ? 'grayscale(1) brightness(0.3)' : 'none',
                  boxShadow: isActive
                    ? `0 0 20px ${stop.color}88`
                    : isDone
                    ? `0 0 12px var(--green)44`
                    : '3px 3px 0 rgba(0,0,0,0.5)',
                  position: 'relative',
                  transition: 'box-shadow 0.3s',
                }}
              >
                {isDone ? (
                  <CheckCircle size={22} color="var(--green)" />
                ) : isLocked ? (
                  <Lock size={20} color={nodeColor} />
                ) : (
                  <stop.Icon size={22} color={stop.color} />
                )}

                {/* Number badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 18,
                    height: 18,
                    background: nodeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      color: '#fff',
                    }}
                  >
                    {stop.id}
                  </span>
                </div>
              </div>

              {/* Popup */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    [popupLeft ? 'right' : 'left']: 64,
                    [popupTop ? 'bottom' : 'top']: 0,
                    zIndex: 20,
                    width: 190,
                  }}
                >
                  <PixelBox color={stop.color} style={{ padding: 12 }}>
                    <p
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 7,
                        color: stop.color,
                        margin: '0 0 4px',
                      }}
                    >
                      STOP {stop.id}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 8,
                        color: 'var(--text)',
                        margin: '0 0 8px',
                        lineHeight: 1.6,
                      }}
                    >
                      {stop.place}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 7,
                        color: 'var(--muted)',
                        margin: '0 0 8px',
                        lineHeight: 1.6,
                      }}
                    >
                      {stop.challenge}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        marginBottom: 10,
                      }}
                    >
                      <span style={{ fontSize: 9 }}>⏱</span>
                      <span
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 7,
                          color: 'var(--muted)',
                        }}
                      >
                        {stop.duration}
                      </span>
                    </div>
                    <PixelBtn
                      color={isDone ? 'var(--green)' : stop.color}
                      onClick={() => toggleStop(stop.id)}
                      style={{ fontSize: 7, padding: '8px 10px', width: '100%', justifyContent: 'center' }}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle size={10} /> DONE
                        </>
                      ) : (
                        <>
                          <Flag size={10} /> MARK DONE
                        </>
                      )}
                    </PixelBtn>
                  </PixelBox>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '16px',
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7,
            color: 'var(--muted)',
            margin: 0,
          }}
        >
          TAP A STOP TO VIEW CHALLENGE
        </p>
      </div>
    </div>
  );
}
