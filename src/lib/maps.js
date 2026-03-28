/** Stable key for quest stops (map remount / geocoding). */
export function stopsFingerprint(stops, searchArea = '') {
  const stopsPart = stops
    .map(s => `${s.id}:${s.place}:${s.lat ?? ''}:${s.lng ?? ''}`)
    .join('|');
  return `${searchArea.trim()}|${stopsPart}`;
}

/**
 * Open Google Maps directions for an ordered list of stops with lat/lng.
 * Falls back to text search if no coordinates are available.
 */
export function openGoogleMapsRoute(stops) {
  const pts = stops
    .filter(s => typeof s.lat === 'number' && typeof s.lng === 'number')
    .sort((a, b) => a.id - b.id);
  if (pts.length === 0) {
    const first = stops?.[0];
    if (first?.place) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(first.place)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
    return;
  }

  if (pts.length === 1) {
    const p = pts[0];
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`,
      '_blank',
      'noopener,noreferrer'
    );
    return;
  }

  const origin = `${pts[0].lat},${pts[0].lng}`;
  const destination = `${pts[pts.length - 1].lat},${pts[pts.length - 1].lng}`;
  const middle = pts.slice(1, -1);
  const params = new URLSearchParams({ api: '1', origin, destination });
  if (middle.length > 0) {
    params.set('waypoints', middle.map(p => `${p.lat},${p.lng}`).join('|'));
  }
  window.open(
    `https://www.google.com/maps/dir/?${params.toString()}`,
    '_blank',
    'noopener,noreferrer'
  );
}

/**
 * Open Maps at a place (coordinates preferred).
 */
export function openGoogleMapsPlace(stop) {
  if (typeof stop.lat === 'number' && typeof stop.lng === 'number') {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`,
      '_blank',
      'noopener,noreferrer'
    );
    return;
  }
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.place || '')}`,
    '_blank',
    'noopener,noreferrer'
  );
}
