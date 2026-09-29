import { useId, useState } from 'react';
import { ChevronDownIcon, CrosshairIcon, PinIcon } from './Icons';

/** Areas Local Mart currently serves.
 *  TODO(catalog): load the served-areas list from the server once it exists. */
const AREAS = [
  'Numaligarh Refinery Township',
  'Numaligarh Bazaar',
  'Dergaon',
  'Bokakhat',
];

type GeoState =
  | { kind: 'idle' }
  | { kind: 'locating' }
  | { kind: 'denied' }
  | { kind: 'unavailable' }
  | { kind: 'located' };

export function LocationPicker() {
  const selectId = useId();
  const [area, setArea] = useState(AREAS[0]);
  const [geo, setGeo] = useState<GeoState>({ kind: 'idle' });

  const useCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeo({ kind: 'unavailable' });
      return;
    }
    setGeo({ kind: 'locating' });
    navigator.geolocation.getCurrentPosition(
      () => {
        // TODO(geo): reverse-geocode the coordinates on the server and match
        // them to a served area. Until then the selection is left as-is.
        setGeo({ kind: 'located' });
      },
      (err) => {
        setGeo(
          err.code === err.PERMISSION_DENIED
            ? { kind: 'denied' }
            : { kind: 'unavailable' },
        );
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  };

  const message =
    geo.kind === 'denied'
      ? 'Location permission is off. Pick your area from the list instead.'
      : geo.kind === 'unavailable'
        ? "We couldn't get your location. Pick your area from the list instead."
        : geo.kind === 'located'
          ? 'Location found. Check the area above is right.'
          : null;

  return (
    <div className="lm-location">
      <div className="lm-location__control">
        <PinIcon className="lm-location__pin" />
        <div className="lm-location__field">
          <label className="lm-location__label" htmlFor={selectId}>
            Deliver to
          </label>
          <select
            id={selectId}
            className="lm-location__select"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <ChevronDownIcon className="lm-location__chevron" aria-hidden="true" />
      </div>

      <button
        type="button"
        className="lm-location__locate"
        onClick={useCurrentLocation}
        disabled={geo.kind === 'locating'}
      >
        <CrosshairIcon className="lm-location__locate-icon" />
        {geo.kind === 'locating' ? 'Finding you…' : 'Use my current location'}
      </button>

      <p
        className={`lm-location__msg${message ? '' : ' lm-visually-hidden'}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}
