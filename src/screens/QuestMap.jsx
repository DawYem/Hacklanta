import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Map,
  CheckCircle,
  Lock,
  Flag,
  Trophy,
  TreePine,
  Navigation,
  ExternalLink,
  MapPin,
  Cloud,
  ListOrdered,
} from 'lucide-react';
import Stars from '../components/Stars';
import ThemeToggle from '../components/ThemeToggle';
import PixelBox from '../components/PixelBox';
import PixelBtn from '../components/PixelBtn';
import PixelAvatar from '../components/PixelAvatar';
import QuestGoogleMap, { ARRIVAL_RADIUS_METERS } from '../components/QuestGoogleMap';
import { openGoogleMapsPlace, openGoogleMapsRoute } from '../lib/maps';

// Base path for SVG nodes (percentages [x, y]); any stop count is sampled along this path
const BASE_QUEST_PATH = [
  [50, 87],
  [22, 67],
  [70, 47],
  [28, 25],
];

function pathLength(points) {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    len += Math.hypot(dx, dy);
  }
  return len;
}

function pointAlongPath(points, t) {
  if (points.length === 0) return [50, 50];
  if (points.length === 1) return points[0];
  const total = pathLength(points);
  let dist = t * total;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const seg = Math.hypot(dx, dy);
    if (dist <= seg) {
      const r = seg === 0 ? 0 : dist / seg;
      return [p0[0] + dx * r, p0[1] + dy * r];
    }
    dist -= seg;
  }
  return points[points.length - 1];
}

function getQuestNodePositions(count) {
  if (count < 1) return [];
  if (count === 1) return [BASE_QUEST_PATH[0]];
  const out = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    out.push(pointAlongPath(BASE_QUEST_PATH, t));
  }
  return out;
}

const TREE_POSITIONS = [
  { left: '8%', top: '20%' },
  { left: '85%', top: '35%' },
  { left: '12%', top: '55%' },
  { left: '78%', top: '65%' },
  { left: '5%', top: '80%' },
  { left: '90%', top: '15%' },
];

const CONTENT_MAX = 560;

export default function QuestMap({
  title = 'QUEST MAP',
  summary = '',
  weather = null,
  searchArea = '',
  avatar = null,
  stops: initialStops,
  onBack,
  onComplete,
}) {
  const [stops, setStops] = useState(() =>
    (initialStops ?? []).map(s => ({ ...s, completed: false }))
  );
  const [selected, setSelected] = useState(null);
  const [navStops, setNavStops] = useState(null);
  const [proximity, setProximity] = useState(null);

  const nodePositions = useMemo(
    () => getQuestNodePositions(stops.length),
    [stops.length]
  );

  const completedCount = stops.filter(s => s.completed).length;
  const hpPercent = stops.length ? Math.round((completedCount / stops.length) * 100) : 0;
  const allDone = stops.length > 0 && completedCount === stops.length;

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

  const handleMarkerSelect = id => {
    const idx = stops.findIndex(s => s.id === id);
    if (idx === -1) return;
    handleNodeClick(stops[idx], idx);
  };

  const routeStops = navStops ?? stops;

  const handleNavigateRoute = () => {
    openGoogleMapsRoute(routeStops);
  };

  const resolveStopForMaps = stop =>
    (navStops ?? stops).find(s => s.id === stop.id) || stop;

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
        @keyframes bob {
          from { transform: translateY(0); }
          to   { transform: translateY(-6px); }
        }
        @keyframes bobCentered {
          from { transform: translateX(-50%) translateY(0); }
          to   { transform: translateX(-50%) translateY(-6px); }
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
          maxWidth: CONTENT_MAX,
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
              {title.toUpperCase()}
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
            {/* Avatar in header */}
            {avatar && (
              <div
                style={{
                  filter: `drop-shadow(0 0 4px ${avatar.color})`,
                  marginLeft: 4,
                  flexShrink: 0,
                }}
              >
                <PixelAvatar grid={avatar.grid} pixelSize={2} />
              </div>
            )}
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

        {summary.trim() ? (
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 6,
              color: 'var(--muted)',
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            {summary}
          </p>
        ) : null}

        {weather ? (
          <PixelBox
            color="var(--blue)"
            style={{
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Cloud size={16} color="var(--blue)" />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 6,
                color: 'var(--blue)',
                lineHeight: 1.7,
              }}
            >
              {weather.city}: {weather.temp}°F · {weather.description}
            </span>
          </PixelBox>
        ) : null}
      </div>

      {/* Map area */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: CONTENT_MAX,
          margin: '0 auto',
          padding: '0 16px',
          minHeight: 400,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          {searchArea.trim() ? (
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                color: 'var(--muted)',
                margin: '0 0 10px',
                lineHeight: 1.6,
              }}
            >
              QUEST AREA: {searchArea.trim().toUpperCase()}
            </p>
          ) : null}
          <QuestGoogleMap
            searchArea={searchArea}
            stops={stops}
            selected={selected}
            onMarkerSelect={handleMarkerSelect}
            firstIncompleteIdx={firstIncompleteIdx}
            completedCount={completedCount}
            onStopsResolved={setNavStops}
            onProximityChange={setProximity}
          />

          {proximity?.atStop && proximity.nearStopId != null ? (
            <PixelBox
              color="var(--green)"
              style={{
                marginTop: 12,
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <MapPin size={16} color="var(--green)" />
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: 'var(--green)',
                  lineHeight: 1.7,
                }}
              >
                YOU&apos;RE AT STOP {proximity.nearStopId} — MARK IT DONE BELOW
              </span>
            </PixelBox>
          ) : null}
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
            <PixelBtn
              color="var(--green)"
              onClick={handleNavigateRoute}
              style={{
                fontSize: 7,
                padding: '10px 14px',
                gap: 8,
              }}
            >
              <Navigation size={12} />
              NAVIGATE ROUTE
            </PixelBtn>
          </div>

          <PixelBox
            color="var(--bg2)"
            style={{
              marginTop: 16,
              padding: '12px 10px',
              border: '2px solid var(--muted)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}
            >
              <ListOrdered size={14} color="var(--yellow)" />
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: 'var(--yellow)',
                }}
              >
                ADVENTURE TIMELINE
              </span>
            </div>
            <div
              style={{
                maxHeight: 'min(36vh, 300px)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                paddingRight: 4,
              }}
            >
              {stops.map((stop, idx) => {
                const locked = idx > firstIncompleteIdx && firstIncompleteIdx !== -1;
                const active = idx === firstIncompleteIdx;
                return (
                  <button
                    key={stop.id}
                    type="button"
                    onClick={() => handleNodeClick(stop, idx)}
                    disabled={locked}
                    style={{
                      textAlign: 'left',
                      padding: '10px 10px',
                      background: active ? 'rgba(245, 200, 66, 0.12)' : 'var(--bg)',
                      border: `2px solid ${locked ? 'var(--muted)' : stop.color}`,
                      cursor: locked ? 'not-allowed' : 'pointer',
                      opacity: locked ? 0.45 : 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 7,
                        color: stop.color,
                      }}
                    >
                      STOP {stop.id}
                      {stop.completed ? ' ✓' : ''}
                    </span>
                    <span
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: 11,
                        color: 'var(--text)',
                        lineHeight: 1.35,
                      }}
                    >
                      {stop.place}
                    </span>
                  </button>
                );
              })}
            </div>
          </PixelBox>
        </div>

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
            points={nodePositions.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />
          {/* Completed overlay */}
          {completedCount > 0 && (
            <polyline
              points={nodePositions
                .slice(0, completedCount + 1)
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
            left: `${nodePositions[0]?.[0] ?? 50}%`,
            top: `${(nodePositions[0]?.[1] ?? 87) + 6}%`,
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
            left: `${nodePositions[nodePositions.length - 1]?.[0] ?? 28}%`,
            top: `${(nodePositions[nodePositions.length - 1]?.[1] ?? 25) - 8}%`,
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
          const [xPct, yPct] = nodePositions[idx] ?? [50, 50];
          const isLocked = idx > firstIncompleteIdx && firstIncompleteIdx !== -1;
          const isActive = idx === firstIncompleteIdx;
          const isDone = stop.completed;
          const isSelected = selected === stop.id;
          const resolved = resolveStopForMaps(stop);

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
              {/* Avatar floating above active node */}
              {isActive && avatar && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 6px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    animation: 'bobCentered 0.8s ease-in-out infinite alternate',
                    filter: `drop-shadow(0 0 6px ${avatar.color})`,
                    zIndex: 5,
                  }}
                >
                  <PixelAvatar grid={avatar.grid} pixelSize={3} />
                </div>
              )}

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
                        margin: '0 0 4px',
                        lineHeight: 1.6,
                      }}
                    >
                      {(resolved.placesName || stop.place)}
                    </p>
                    {resolved.placesAddress ? (
                      <p
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 6,
                          color: 'var(--muted)',
                          margin: '0 0 8px',
                          lineHeight: 1.5,
                        }}
                      >
                        {resolved.placesAddress}
                      </p>
                    ) : (
                      <div style={{ marginBottom: 8 }} />
                    )}
                    {proximity?.nearStopId === stop.id &&
                    proximity.meters != null &&
                    !proximity.atStop ? (
                      <p
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 6,
                          color: 'var(--yellow)',
                          margin: '0 0 8px',
                        }}
                      >
                        ~{proximity.meters}M TO PIN — GET WITHIN {ARRIVAL_RADIUS_METERS}M TO CHECK IN
                      </p>
                    ) : null}
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
                      color="var(--muted)"
                      onClick={() => openGoogleMapsPlace(resolved)}
                      style={{
                        fontSize: 7,
                        padding: '8px 10px',
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <ExternalLink size={10} /> OPEN IN MAPS
                    </PixelBtn>
                    <PixelBtn
                      color={
                        isDone
                          ? 'var(--green)'
                          : proximity?.atStop && proximity.nearStopId === stop.id
                          ? 'var(--green)'
                          : stop.color
                      }
                      onClick={() => toggleStop(stop.id)}
                      style={{
                        fontSize: 7,
                        padding: '8px 10px',
                        width: '100%',
                        justifyContent: 'center',
                        boxShadow:
                          !isDone &&
                          proximity?.atStop &&
                          proximity.nearStopId === stop.id
                            ? '0 0 16px rgba(74, 222, 128, 0.65)'
                            : undefined,
                      }}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle size={10} /> DONE
                        </>
                      ) : proximity?.atStop && proximity.nearStopId === stop.id ? (
                        <>
                          <MapPin size={10} /> CHECK IN — I&apos;M HERE
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
          maxWidth: CONTENT_MAX,
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
