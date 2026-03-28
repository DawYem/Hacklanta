import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { stopsFingerprint } from '../lib/maps';
import { useTheme } from '../context/theme-context';

const MAP_STYLES_DARK = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1f0d' }] },
];

const MAP_STYLES_LIGHT = [
  { elementType: 'geometry', stylers: [{ color: '#f0f0f0' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f0f0f0' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#444444' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#d8d8e8' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#b0c8e0' }] },
];

/** Large, responsive map — README: mobile-friendly, city-as-playground */
const containerStyle = {
  width: '100%',
  height: 'clamp(320px, 54vh, 640px)',
  minHeight: 320,
  borderRadius: 18,
};

const defaultCenter = { lat: 33.775, lng: -84.375 };

/** Order must stay stable for the loader URL (Google recommendation). */
const MAP_LIBRARIES = ['geometry', 'places'];

/** Meters — within this radius of the next stop counts as "arrived" for check-in UI */
export const ARRIVAL_RADIUS_METERS = 85;

const MAP_LOAD_TIMEOUT_MS = 25000;

function formatLoadError(err) {
  if (err == null || err === '') return '';
  if (err instanceof Error) {
    return [err.name, err.message].filter(Boolean).join(': ') || 'Error';
  }
  if (typeof err === 'string') return err;
  try {
    const s = JSON.stringify(err);
    return s === '{}' ? '' : s;
  } catch {
    return String(err);
  }
}

function MapProblemPanel({ title, detail, hint }) {
  return (
    <div
      style={{
        minHeight: containerStyle.height,
        background: 'var(--bg2)',
        border: '2px solid var(--red, #e8534a)',
        borderRadius: 18,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        justifyContent: 'center',
      }}
    >
      <p
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 9,
          color: 'var(--red, #e8534a)',
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {title}
      </p>
      {detail ? (
        <p
          style={{
            fontFamily: 'system-ui, Segoe UI, sans-serif',
            fontSize: 14,
            color: 'var(--text)',
            margin: 0,
            lineHeight: 1.45,
            wordBreak: 'break-word',
          }}
        >
          {detail}
        </p>
      ) : null}
      <p
        style={{
          fontFamily: 'system-ui, Segoe UI, sans-serif',
          fontSize: 12,
          color: 'var(--muted)',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {hint}
      </p>
    </div>
  );
}

function geocodePromise(geocoder, request) {
  return new Promise(resolve => {
    geocoder.geocode(request, (results, status) => {
      resolve({ results, status });
    });
  });
}

function textSearchPromise(placesService, request) {
  return new Promise(resolve => {
    placesService.textSearch(request, (results, status) => {
      resolve({ results, status });
    });
  });
}

function NoKeyPlaceholder() {
  return (
    <div
      style={{
        height: containerStyle.height,
        background: 'var(--bg2)',
        border: '2px dashed var(--muted)',
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 7,
          color: 'var(--muted)',
          margin: 0,
          lineHeight: 1.8,
        }}
      >
        ADD VITE_MAPS_PLATFORM_API_KEY TO .ENV FOR LIVE MAP
      </p>
    </div>
  );
}

function QuestGoogleMapInner({
  apiKey,
  searchArea = '',
  stops,
  selected,
  onMarkerSelect,
  firstIncompleteIdx,
  completedCount,
  onStopsResolved,
  onProximityChange,
}) {
  const { theme } = useTheme();
  const mapStyles = theme === 'light' ? MAP_STYLES_LIGHT : MAP_STYLES_DARK;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'hacklanta-google-maps',
    version: 'weekly',
    googleMapsApiKey: apiKey,
    libraries: MAP_LIBRARIES,
  });

  const areaTrim = searchArea?.trim() ?? '';
  const ignorePresetCoords = Boolean(areaTrim);

  const allHaveCoords = useMemo(() => {
    if (ignorePresetCoords) return false;
    return stops.every(
      s => typeof s.lat === 'number' && typeof s.lng === 'number'
    );
  }, [stops, ignorePresetCoords]);

  const [geocodedStops, setGeocodedStops] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [authFailure, setAuthFailure] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const mapRef = useRef(null);
  const resolveStartedRef = useRef(false);

  useEffect(() => {
    const prev = window.gm_authFailure;
    window.gm_authFailure = () => {
      setAuthFailure(true);
      if (typeof prev === 'function') prev();
    };
    return () => {
      window.gm_authFailure = prev;
    };
  }, []);

  useEffect(() => {
    if (isLoaded) setLoadTimedOut(false);
  }, [isLoaded]);

  useEffect(() => {
    if (!loadError) return;
    const text = formatLoadError(loadError);
    console.error('[Hacklanta Map] useJsApiLoader error:', loadError, text);
  }, [loadError]);

  useEffect(() => {
    if (isLoaded || loadError) return;
    const t = window.setTimeout(() => {
      setLoadTimedOut(true);
      console.warn(
        '[Hacklanta Map] Still not loaded after',
        MAP_LOAD_TIMEOUT_MS,
        'ms. Check F12 Console, API key, billing, and network.'
      );
    }, MAP_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [isLoaded, loadError]);

  const resolvedStops = useMemo(() => {
    if (allHaveCoords) return stops;
    return geocodedStops ?? stops;
  }, [allHaveCoords, stops, geocodedStops]);

  const geoDone = allHaveCoords || geocodedStops !== null;

  useEffect(() => {
    if (!geoDone) return;
    onStopsResolved?.(resolvedStops);
  }, [resolvedStops, onStopsResolved, geoDone]);

  const resolveStopsOnMap = useCallback(
    map => {
      if (!map || !window.google?.maps || allHaveCoords) return;
      if (resolveStartedRef.current) return;
      resolveStartedRef.current = true;
      setResolving(true);

      const geocoder = new window.google.maps.Geocoder();
      const PlacesStatus = window.google.maps.places.PlacesServiceStatus;
      const placesService = new window.google.maps.places.PlacesService(map);

      (async () => {
        try {
        let anchorLatLng = new window.google.maps.LatLng(
          defaultCenter.lat,
          defaultCenter.lng
        );
        let biasBounds = null;

        if (areaTrim) {
          const anchor = await geocodePromise(geocoder, { address: areaTrim });
          if (
            anchor.status === 'OK' &&
            anchor.results[0]?.geometry?.location
          ) {
            anchorLatLng = anchor.results[0].geometry.location;
            const g = anchor.results[0].geometry;
            biasBounds = g.bounds || g.viewport;
          }
        }

        const out = [];

        for (const stop of stops) {
          if (
            !ignorePresetCoords &&
            typeof stop.lat === 'number' &&
            typeof stop.lng === 'number'
          ) {
            out.push(stop);
            continue;
          }

          let placed = null;

          try {
            const ts = await textSearchPromise(placesService, {
              query: stop.place,
              location: anchorLatLng,
              radius: 15000,
            });

            if (ts.status === PlacesStatus.OK && ts.results?.length) {
              const r = ts.results[0];
              const loc = r.geometry?.location;
              if (loc) {
                placed = {
                  ...stop,
                  lat: loc.lat(),
                  lng: loc.lng(),
                  placesName: r.name,
                  placesAddress: r.formatted_address,
                  placesId: r.place_id,
                };
              }
            }
          } catch {
            /* fall through to geocoder */
          }

          if (!placed) {
            const req = { address: stop.place };
            if (biasBounds) req.bounds = biasBounds;
            const gc = await geocodePromise(geocoder, req);
            if (gc.status === 'OK' && gc.results[0]) {
              const loc = gc.results[0].geometry.location;
              placed = {
                ...stop,
                lat: loc.lat(),
                lng: loc.lng(),
              };
            } else {
              placed = {
                ...stop,
                lat: defaultCenter.lat,
                lng: defaultCenter.lng,
              };
            }
          }

          out.push(placed);
        }

        setGeocodedStops(out);
        } finally {
          setResolving(false);
        }
      })();
    },
    [
      allHaveCoords,
      areaTrim,
      ignorePresetCoords,
      stops,
    ]
  );

  const onLoad = useCallback(
    map => {
      mapRef.current = map;
      if (!allHaveCoords) {
        resolveStopsOnMap(map);
      }
      requestAnimationFrame(() => {
        if (mapRef.current) fitMapToContentRef.current?.();
      });
    },
    [allHaveCoords, resolveStopsOnMap]
  );

  const fitMapToContentRef = useRef(() => {});

  const fitMapToContent = useCallback(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) return;
    const pts = resolvedStops
      .filter(s => typeof s.lat === 'number' && typeof s.lng === 'number')
      .map(s => ({ lat: s.lat, lng: s.lng }));
    if (userPos) pts.push(userPos);
    if (pts.length === 0) return;
    if (pts.length === 1) {
      map.setCenter(pts[0]);
      map.setZoom(14);
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    pts.forEach(p => bounds.extend(p));
    map.fitBounds(bounds, { top: 36, right: 36, bottom: 36, left: 36 });
  }, [resolvedStops, userPos]);

  fitMapToContentRef.current = fitMapToContent;

  useEffect(() => {
    if (!geoDone || !mapRef.current) return;
    fitMapToContent();
  }, [geoDone, fitMapToContent, userPos]);

  const proximityRef = useRef(null);

  useEffect(() => {
    if (!geoDone || !onProximityChange) return;
    if (!navigator.geolocation) {
      onProximityChange({
        nearStopId: null,
        meters: null,
        atStop: false,
      });
      return;
    }

    const emit = payload => {
      const prev = proximityRef.current;
      if (
        prev &&
        prev.nearStopId === payload.nearStopId &&
        prev.atStop === payload.atStop &&
        prev.meters === payload.meters
      ) {
        return;
      }
      proximityRef.current = payload;
      onProximityChange(payload);
    };

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const user = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserPos(user);

        const g = window.google?.maps;
        if (!g?.geometry?.spherical) return;

        const nextIncomplete = [...resolvedStops]
          .filter(
            s =>
              !s.completed &&
              typeof s.lat === 'number' &&
              typeof s.lng === 'number'
          )
          .sort((a, b) => a.id - b.id)[0];

        if (!nextIncomplete) {
          emit({ nearStopId: null, meters: null, atStop: false });
          return;
        }

        const a = new g.LatLng(user.lat, user.lng);
        const b = new g.LatLng(nextIncomplete.lat, nextIncomplete.lng);
        const meters = g.geometry.spherical.computeDistanceBetween(a, b);
        const rounded = Math.round(meters);
        const atStop = meters <= ARRIVAL_RADIUS_METERS;

        emit({
          nearStopId: nextIncomplete.id,
          meters: rounded,
          atStop,
        });
      },
      () => {
        emit({ nearStopId: null, meters: null, atStop: false });
      },
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 20000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [geoDone, resolvedStops, onProximityChange]);

  const orderedPath = useMemo(() => {
    return resolvedStops
      .filter(s => typeof s.lat === 'number' && typeof s.lng === 'number')
      .sort((a, b) => a.id - b.id)
      .map(s => ({ lat: s.lat, lng: s.lng }));
  }, [resolvedStops]);

  const guideToNextPath = useMemo(() => {
    if (!userPos) return [];
    const sorted = [...resolvedStops]
      .filter(s => typeof s.lat === 'number' && typeof s.lng === 'number')
      .sort((a, b) => a.id - b.id);
    const next = sorted.find(s => !s.completed);
    if (!next) return [];
    return [userPos, { lat: next.lat, lng: next.lng }];
  }, [resolvedStops, userPos]);

  const completedPath = useMemo(() => {
    if (orderedPath.length < 2 || completedCount <= 0) return [];
    const n = Math.min(completedCount + 1, orderedPath.length);
    return orderedPath.slice(0, n);
  }, [orderedPath, completedCount]);

  const center = useMemo(() => {
    const pts = resolvedStops.filter(
      s => typeof s.lat === 'number' && typeof s.lng === 'number'
    );
    if (pts.length === 0) return defaultCenter;
    const lat = pts.reduce((a, s) => a + s.lat, 0) / pts.length;
    const lng = pts.reduce((a, s) => a + s.lng, 0) / pts.length;
    return { lat, lng };
  }, [resolvedStops]);

  const validStops = useMemo(
    () =>
      resolvedStops.filter(
        s => typeof s.lat === 'number' && typeof s.lng === 'number'
      ),
    [resolvedStops]
  );

  if (authFailure) {
    return (
      <MapProblemPanel
        title="GOOGLE MAPS REJECTED THIS KEY"
        detail="Invalid API key, or this site is not allowed to use the key (referrer / HTTP restriction)."
        hint="In Google Cloud → Credentials → your key: add HTTP referrer http://localhost:5173/* (and your deploy URL). Enable Maps JavaScript API and billing. Restart npm run dev after changing .env."
      />
    );
  }

  if (loadError) {
    const msg = formatLoadError(loadError);
    return (
      <MapProblemPanel
        title="MAP SCRIPT ERROR"
        detail={
          msg ||
          '(No message from the loader — Google often logs the real error in the browser console.)'
        }
        hint="Open DevTools (F12) → Console. Look for red errors from maps.googleapis.com. Enable Maps JavaScript API, Places API, Geocoding API; link billing; fix key referrer; ensure VITE_MAPS_PLATFORM_API_KEY in .env has no space after = and restart Vite."
      />
    );
  }

  if (!isLoaded && loadTimedOut) {
    return (
      <MapProblemPanel
        title="MAP STUCK LOADING"
        detail="The Maps JavaScript file did not finish loading in time (or was blocked)."
        hint="1) F12 → Console / Network: blocked maps.googleapis.com? 2) Ad blocker off for localhost. 3) Same Wi‑Fi / no VPN blocking Google. 4) Confirm API key, billing, and Maps JavaScript API enabled. Hard refresh (Ctrl+Shift+R)."
      />
    );
  }

  if (!isLoaded) {
    return (
      <div
        style={{
          minHeight: containerStyle.height,
          background: 'var(--bg2)',
          border: '2px solid var(--muted)',
          borderRadius: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          gap: 12,
        }}
      >
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            color: 'var(--muted)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          LOADING MAP...
        </p>
        <p
          style={{
            fontFamily: 'system-ui, Segoe UI, sans-serif',
            fontSize: 12,
            color: 'var(--muted)',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          If this never finishes, press F12 → Console and look for errors from googleapis.com
        </p>
      </div>
    );
  }

  const showOverlay = resolving || (!allHaveCoords && !geoDone);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
      }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: mapStyles,
        }}
      >
        {geoDone && orderedPath.length >= 2 && (
          <Polyline
            path={orderedPath}
            options={{
              strokeColor: theme === 'light' ? '#c0c0d8' : '#2a2a2a',
              strokeOpacity: 0.95,
              strokeWeight: 4,
              zIndex: 1,
            }}
          />
        )}
        {geoDone && completedPath.length >= 2 && (
          <Polyline
            path={completedPath}
            options={{
              strokeColor: '#4ade80',
              strokeOpacity: 0.95,
              strokeWeight: 4,
              zIndex: 2,
            }}
          />
        )}
        {geoDone && guideToNextPath.length === 2 && (
          <Polyline
            path={guideToNextPath}
            options={{
              strokeColor: '#60a5fa',
              strokeOpacity: 0.85,
              strokeWeight: 3,
              zIndex: 3,
              icons: [
                {
                  icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 3,
                  },
                  offset: '0',
                  repeat: '14px',
                },
              ],
            }}
          />
        )}

        {geoDone &&
          userPos && (
            <Marker
              position={userPos}
              options={{
                zIndex: 500,
                label: {
                  text: 'YOU',
                  color: theme === 'light' ? '#0d0d1a' : '#ffffff',
                  fontSize: '9px',
                  fontWeight: 'bold',
                },
              }}
            />
          )}

        {geoDone &&
          validStops.map((stop, idx) => {
            const isLocked = idx > firstIncompleteIdx && firstIncompleteIdx !== -1;
            const isSelected = selected === stop.id;
            return (
              <Marker
                key={stop.id}
                position={{ lat: stop.lat, lng: stop.lng }}
                onClick={() => {
                  if (isLocked) return;
                  onMarkerSelect(stop.id);
                }}
                options={{
                  opacity: isLocked ? 0.35 : 1,
                  zIndex: isSelected ? 1000 : idx,
                  title: stop.placesName || stop.place,
                  label: {
                    text: String(stop.id),
                    color: theme === 'light' ? '#0d0d1a' : '#ffffff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  },
                }}
              />
            );
          })}
      </GoogleMap>

      {showOverlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: theme === 'light' ? 'rgba(240,240,255,0.82)' : 'rgba(0,0,0,0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            padding: 16,
          }}
        >
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: 'var(--yellow)',
              margin: 0,
              textAlign: 'center',
              lineHeight: 1.9,
            }}
          >
            FINDING REAL PLACES WITH GOOGLE PLACES
            {areaTrim ? (
              <>
                <br />
                NEAR {areaTrim.toUpperCase()}...
              </>
            ) : (
              '...'
            )}
          </p>
        </div>
      )}

      {areaTrim ? (
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 6,
            color: 'var(--muted)',
            margin: '8px 0 0',
            lineHeight: 1.6,
          }}
        >
          WALK TO THE PIN; WITHIN ~{ARRIVAL_RADIUS_METERS}M YOU CAN CHECK IN. ALLOW LOCATION.
        </p>
      ) : null}
    </div>
  );
}

export default function QuestGoogleMap(props) {
  const apiKey = import.meta.env.VITE_MAPS_PLATFORM_API_KEY?.trim() ?? '';
  if (!apiKey) {
    return <NoKeyPlaceholder />;
  }
  const mapKey = stopsFingerprint(props.stops, props.searchArea ?? '');
  return <QuestGoogleMapInner key={mapKey} apiKey={apiKey} {...props} />;
}
