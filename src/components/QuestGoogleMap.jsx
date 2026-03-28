import { useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '240px',
  borderRadius: 0,
};

const defaultCenter = { lat: 33.775, lng: -84.375 };

function NoKeyPlaceholder() {
  return (
    <div
      style={{
        height: containerStyle.height,
        background: 'var(--bg2)',
        border: '3px solid var(--muted)',
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
  stops,
  selected,
  onMarkerSelect,
  firstIncompleteIdx,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'hacklanta-map',
    googleMapsApiKey: apiKey,
  });

  const validStops = useMemo(
    () => stops.filter(s => typeof s.lat === 'number' && typeof s.lng === 'number'),
    [stops]
  );

  const center = useMemo(() => {
    if (validStops.length === 0) return defaultCenter;
    const lat = validStops.reduce((a, s) => a + s.lat, 0) / validStops.length;
    const lng = validStops.reduce((a, s) => a + s.lng, 0) / validStops.length;
    return { lat, lng };
  }, [validStops]);

  const onLoad = useCallback(
    map => {
      if (validStops.length < 2) return;
      const bounds = new window.google.maps.LatLngBounds();
      validStops.forEach(s => bounds.extend({ lat: s.lat, lng: s.lng }));
      map.fitBounds(bounds, { top: 24, right: 24, bottom: 24, left: 24 });
    },
    [validStops]
  );

  if (loadError) {
    return (
      <div
        style={{
          height: containerStyle.height,
          background: 'var(--bg2)',
          border: '3px solid var(--red, #e8534a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7,
            color: 'var(--red, #e8534a)',
            margin: 0,
          }}
        >
          MAP FAILED TO LOAD
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        style={{
          height: containerStyle.height,
          background: 'var(--bg2)',
          border: '3px solid var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          LOADING MAP...
        </p>
      </div>
    );
  }

  return (
    <div style={{ border: '3px solid var(--green)', overflow: 'hidden' }}>
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
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#2a2a2a' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#0d1f0d' }],
            },
          ],
        }}
      >
        {validStops.map((stop, idx) => {
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
                label: {
                  text: String(stop.id),
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                },
              }}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}

export default function QuestGoogleMap(props) {
  const apiKey = import.meta.env.VITE_MAPS_PLATFORM_API_KEY?.trim() ?? '';
  if (!apiKey) {
    return <NoKeyPlaceholder />;
  }
  return <QuestGoogleMapInner apiKey={apiKey} {...props} />;
}
