import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Cloud,
  ExternalLink,
  Flag,
  ListOrdered,
  Map,
  MapPin,
  Navigation,
} from 'lucide-react';
import Stars from '../components/Stars';
import ThemeToggle from '../components/ThemeToggle';
import PixelBox from '../components/PixelBox';
import PixelBtn from '../components/PixelBtn';
import PixelAvatar from '../components/PixelAvatar';
import QuestGoogleMap, { ARRIVAL_RADIUS_METERS } from '../components/QuestGoogleMap';
import { openGoogleMapsPlace, openGoogleMapsRoute } from '../lib/maps';

const CONTENT_MAX = 980;

function panelLabel(text, color = 'var(--muted)') {
  return {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 10,
    color,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    margin: 0,
  };
}

function bodyText(color = 'var(--text)', size = 10) {
  return {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: size,
    color,
    lineHeight: 1.6,
    margin: 0,
  };
}

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


  const completedCount = stops.filter(s => s.completed).length;
  const hpPercent = stops.length ? Math.round((completedCount / stops.length) * 100) : 0;
  const allDone = stops.length > 0 && completedCount === stops.length;
  const firstIncompleteIdx = stops.findIndex(s => !s.completed);

  useEffect(() => {
    if (allDone) {
      const id = setTimeout(onComplete, 800);
      return () => clearTimeout(id);
    }
  }, [allDone, onComplete]);

  const toggleStop = id => {
    setStops(prev =>
      prev.map(s => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleNodeClick = (stop, idx) => {
    const isLocked = idx > firstIncompleteIdx && firstIncompleteIdx !== -1;
    if (isLocked) return;
    setSelected(current => (current === stop.id ? null : stop.id));
  };

  const handleMarkerSelect = id => {
    const idx = stops.findIndex(s => s.id === id);
    if (idx === -1) return;
    handleNodeClick(stops[idx], idx);
  };

  const routeStops = navStops ?? stops;
  const selectedStop = stops.find(stop => stop.id === selected) ?? null;
  const selectedStopResolved = selectedStop
    ? routeStops.find(stop => stop.id === selectedStop.id) || selectedStop
    : null;

  const activeStop = firstIncompleteIdx >= 0 ? stops[firstIncompleteIdx] : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(35, 59, 90, 0.35), transparent 42%), var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Stars />
      <ThemeToggle />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: CONTENT_MAX,
          margin: '0 auto',
          padding: '24px 16px 32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            marginBottom: 18,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text)',
              padding: 4,
              display: 'flex',
              marginTop: 4,
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <PixelBox
              color="var(--yellow)"
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 10,
              }}
            >
              <Map size={16} color="var(--yellow)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={panelLabel('Active Quest', 'var(--yellow)')}>Active Quest</p>
                <p
                  style={{
                    ...panelLabel(title, 'var(--text)'),
                    fontSize: 10,
                    marginTop: 6,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {title}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <p style={panelLabel('Progress', 'var(--green)')}>Progress</p>
                  <p style={{ ...panelLabel(`${completedCount}/${stops.length}`, 'var(--green)'), marginTop: 6 }}>
                    {completedCount}/{stops.length}
                  </p>
                </div>
                {avatar ? (
                  <div style={{ filter: `drop-shadow(0 0 5px ${avatar.color})` }}>
                    <PixelAvatar grid={avatar.grid} pixelSize={2} />
                  </div>
                ) : null}
              </div>
            </PixelBox>

            <div
              style={{
                height: 10,
                background: 'var(--bg2)',
                border: '2px solid var(--bg2)',
                marginBottom: 12,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${hpPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--green), #77f2a7)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: 10,
              }}
            >
              <PixelBox color="var(--bg2)" style={{ padding: '12px 14px', boxShadow: 'none' }}>
                <p style={panelLabel('Quest Brief', 'var(--yellow)')}>Quest Brief</p>
                <p style={{ ...bodyText('var(--muted)', 8), marginTop: 10 }}>
                  {summary.trim() || 'Follow the route, unlock each stop in order, and finish the adventure.'}
                </p>
              </PixelBox>

              <PixelBox color="var(--bg2)" style={{ padding: '12px 14px', boxShadow: 'none' }}>
                <p style={panelLabel('Quest Area', 'var(--blue)')}>Quest Area</p>
                <p style={{ ...bodyText('var(--text)', 8), marginTop: 10 }}>
                  {searchArea.trim() || 'Current area'}
                </p>
              </PixelBox>

              {weather ? (
                <PixelBox color="var(--bg2)" style={{ padding: '12px 14px', boxShadow: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Cloud size={15} color="var(--blue)" />
                    <p style={panelLabel('Weather', 'var(--blue)')}>Weather</p>
                  </div>
                  <p style={{ ...bodyText('var(--text)', 8), marginTop: 10 }}>
                    {weather.city}: {weather.temp}°F
                  </p>
                  <p style={{ ...bodyText('var(--muted)', 8), marginTop: 6 }}>
                    {weather.description}
                  </p>
                </PixelBox>
              ) : null}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 18,
            alignItems: 'start',
          }}
        >
          <PixelBox
            color="var(--green)"
            style={{
              padding: 0,
              overflow: 'hidden',
              background: 'var(--bg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                padding: '14px 16px',
                borderBottom: '2px solid var(--border)',
                background: 'transparent',
              }}
            >
              <div>
                <p style={panelLabel('Live Map', 'var(--green)')}>Live Map</p>
                <p style={{ ...bodyText('var(--muted)', 8), marginTop: 6 }}>
                  Use the map as the route view, then handle stop details from the mission panel.
                </p>
              </div>
              <PixelBtn
                color="var(--green)"
                onClick={() => openGoogleMapsRoute(routeStops)}
                style={{
                  fontSize: 7,
                  padding: '10px 12px',
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <Navigation size={12} />
                NAVIGATE
              </PixelBtn>
            </div>

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

            <div
              style={{
                padding: '12px 16px 16px',
                borderTop: '2px solid var(--border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 10,
              }}
            >
              <div
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                }}
              >
                <p style={panelLabel('Next Stop', 'var(--yellow)')}>Next Stop</p>
                <p style={{ ...bodyText('var(--text)', 8), marginTop: 8 }}>
                  {activeStop ? `Stop ${activeStop.id}: ${activeStop.place}` : 'Quest complete'}
                </p>
              </div>

              <div
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                }}
              >
                <p style={panelLabel('Check-In', 'var(--blue)')}>Check-In</p>
                <p style={{ ...bodyText('var(--text)', 8), marginTop: 8 }}>
                  {proximity?.atStop && proximity.nearStopId != null
                    ? `You are at Stop ${proximity.nearStopId}`
                    : proximity?.nearStopId != null && proximity.meters != null
                    ? `${proximity.meters}m from Stop ${proximity.nearStopId}`
                    : `Get within ${ARRIVAL_RADIUS_METERS}m to auto-verify arrival`}
                </p>
              </div>
            </div>
          </PixelBox>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <PixelBox color={selectedStop ? selectedStop.color : 'var(--yellow)'}>
              <p style={panelLabel(selectedStop ? `Stop ${selectedStop.id}` : 'Mission Panel', selectedStop ? selectedStop.color : 'var(--yellow)')}>
                {selectedStop ? `Stop ${selectedStop.id}` : 'Mission Panel'}
              </p>

              {selectedStop ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      marginTop: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        border: `2px solid ${selectedStop.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: 'var(--bg2)',
                      }}
                    >
                      <selectedStop.Icon size={20} color={selectedStop.color} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <p style={{ ...bodyText('var(--text)', 8), fontWeight: 700 }}>
                        {selectedStopResolved?.placesName || selectedStop.place}
                      </p>
                      {selectedStopResolved?.placesAddress ? (
                        <p style={{ ...bodyText('var(--muted)', 8), marginTop: 6 }}>
                          {selectedStopResolved.placesAddress}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <p style={{ ...bodyText('var(--muted)', 8), marginBottom: 14 }}>
                    {selectedStop.challenge}
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 10,
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 12px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg2)',
                      }}
                    >
                      <p style={panelLabel('Duration', 'var(--muted)')}>Duration</p>
                      <p style={{ ...bodyText('var(--text)', 8), marginTop: 8 }}>
                        {selectedStop.duration}
                      </p>
                    </div>
                    <div
                      style={{
                        padding: '10px 12px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg2)',
                      }}
                    >
                      <p style={panelLabel('Status', 'var(--muted)')}>Status</p>
                      <p style={{ ...bodyText('var(--text)', 8), marginTop: 8 }}>
                        {selectedStop.completed
                          ? 'Completed'
                          : proximity?.nearStopId === selectedStop.id && proximity?.atStop
                          ? 'Ready to check in'
                          : 'In progress'}
                      </p>
                    </div>
                  </div>

                  {proximity?.nearStopId === selectedStop.id &&
                  proximity.meters != null &&
                  !proximity.atStop ? (
                    <p style={{ ...bodyText('var(--yellow)', 8), marginBottom: 14 }}>
                      You are about {proximity.meters}m away. Get within {ARRIVAL_RADIUS_METERS}m to check in instantly.
                    </p>
                  ) : null}

                  <PixelBtn
                    color="var(--muted)"
                    onClick={() => openGoogleMapsPlace(selectedStopResolved)}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: 7,
                      padding: '10px 12px',
                      marginBottom: 10,
                    }}
                  >
                    <ExternalLink size={11} />
                    OPEN IN MAPS
                  </PixelBtn>

                  <PixelBtn
                    color={
                      selectedStop.completed ||
                      (proximity?.nearStopId === selectedStop.id && proximity?.atStop)
                        ? 'var(--green)'
                        : selectedStop.color
                    }
                    onClick={() => toggleStop(selectedStop.id)}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: 7,
                      padding: '10px 12px',
                    }}
                  >
                    {selectedStop.completed ? (
                      <>
                        <CheckCircle size={11} />
                        DONE
                      </>
                    ) : proximity?.nearStopId === selectedStop.id && proximity?.atStop ? (
                      <>
                        <MapPin size={11} />
                        CHECK IN
                      </>
                    ) : (
                      <>
                        <Flag size={11} />
                        MARK DONE
                      </>
                    )}
                  </PixelBtn>
                </>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <p style={{ ...bodyText('var(--muted)', 8) }}>
                    Tap a stop marker on the map or pick one from the adventure timeline to view the location details and mission prompt.
                  </p>
                </div>
              )}
            </PixelBox>

            <PixelBox color="var(--yellow)">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <ListOrdered size={14} color="var(--yellow)" />
                <p style={panelLabel('Adventure Timeline', 'var(--yellow)')}>Adventure Timeline</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stops.map((stop, idx) => {
                  const locked = idx > firstIncompleteIdx && firstIncompleteIdx !== -1;
                  const active = idx === firstIncompleteIdx;
                  const selectedNow = selected === stop.id;

                  return (
                    <button
                      key={stop.id}
                      type="button"
                      onClick={() => handleNodeClick(stop, idx)}
                      disabled={locked}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 12px',
                        background: selectedNow
                          ? 'var(--bg2)'
                          : active
                          ? 'var(--bg2)'
                          : 'var(--bg)',
                        border: `2px solid ${locked ? 'var(--muted)' : stop.color}`,
                        cursor: locked ? 'not-allowed' : 'pointer',
                        opacity: locked ? 0.42 : 1,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          border: `2px solid ${locked ? 'var(--muted)' : stop.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {stop.completed ? (
                          <CheckCircle size={16} color="var(--green)" />
                        ) : (
                          <stop.Icon size={16} color={locked ? 'var(--muted)' : stop.color} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={panelLabel(`Stop ${stop.id}`, locked ? 'var(--muted)' : stop.color)}>
                          Stop {stop.id}
                        </p>
                        <p style={{ ...bodyText('var(--text)', 8), marginTop: 6 }}>
                          {stop.place}
                        </p>
                        <p style={{ ...bodyText('var(--muted)', 8), marginTop: 6 }}>
                          {stop.challenge}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </PixelBox>
          </div>
        </div>
      </div>
    </div>
  );
}
