import { useEffect, useId, useRef, useState } from "react";
import { CrosshairIcon, PinIcon } from "./Icons";

/** Areas Local Mart delivers to. Anything else is out of range.
 *  TODO(catalog): load the served-areas list from the server once it exists. */
const AREAS = ["Numaligarh Refinery Township", "Telgaram"];

/** Case, stray spacing and trailing punctuation shouldn't decide delivery. */
const normalise = (value: string) =>
  value.trim().toLowerCase().replace(/[.,]+/g, "").replace(/\s+/g, " ");

/**
 * Areas are matched whole — never by prefix or substring.
 *
 * Numaligarh Bazaar and Numaligarh Refinery Township are different places and
 * only the second is served, so a loose test would clear an address we can't
 * actually reach. The geocoder also reports a "Numaligarh" several kilometres
 * outside the served area, which a partial match would wrongly accept.
 */
const matchArea = (value: string): string | undefined =>
  AREAS.find((area) => normalise(area) === normalise(value));

/**
 * OpenStreetMap's reverse geocoder: free, keyless and CORS-enabled, so the
 * lookup runs from the browser with nothing to configure.
 *
 * TODO(geo): move this behind our own API. Doing so keeps customer
 * coordinates on our infrastructure instead of a third party's, lets us cache
 * repeat lookups, and respects Nominatim's usage policy at real traffic.
 */
const REVERSE_GEOCODE_URL = "https://nominatim.openstreetmap.org/reverse";

/**
 * Address keys OSM uses for a place of roughly township size, most specific
 * first. Which one carries the name varies by how the area was mapped — the
 * refinery township comes back as hamlet "Numaligarh" inside village
 * "Telgaram" — so every one of them is checked against the served list.
 */
const PLACE_KEYS = [
  "neighbourhood",
  "quarter",
  "suburb",
  "hamlet",
  "village",
  "town",
  "municipality",
  "city_district",
  "city",
  "county",
] as const;

interface ReverseGeocodeResult {
  /** A served area, when one of the returned names is on the list. */
  matched?: string;
  /** The most specific place name OSM gave back, matched or not. */
  detected?: string;
}

const reverseGeocode = async (
  latitude: number,
  longitude: number,
  signal: AbortSignal,
): Promise<ReverseGeocodeResult> => {
  const url =
    `${REVERSE_GEOCODE_URL}?format=jsonv2&addressdetails=1&zoom=14` +
    `&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`;

  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Reverse geocode failed with ${response.status}`);
  }

  const body: { address?: Record<string, string>; name?: string } =
    await response.json();
  const address = body.address ?? {};

  const names = PLACE_KEYS.map((key) => address[key]).filter(
    (name): name is string => Boolean(name),
  );

  return {
    matched: names.map(matchArea).find(Boolean),
    detected: names[0] ?? body.name ?? undefined,
  };
};

type Serviceability =
  /** Nothing detected yet. */
  | { kind: "unknown" }
  | { kind: "serviceable"; area: string }
  | { kind: "unreachable"; detected: string };

type GeoState =
  | { kind: "idle" }
  /** Permission prompt is up, or the browser is getting a fix. */
  | { kind: "locating" }
  /** Have coordinates, waiting on the geocoder for a place name. */
  | { kind: "resolving" }
  | { kind: "denied" }
  | { kind: "insecure" }
  | { kind: "timeout" }
  | { kind: "unavailable" }
  /** Located fine, but the geocoder gave nothing we could read. */
  | { kind: "unnamed" }
  /** The lookup itself failed — offline, blocked, or the service is down. */
  | { kind: "lookupFailed" };

export function LocationPicker() {
  const noticeId = useId();
  const [result, setResult] = useState<Serviceability>({ kind: "unknown" });
  const [geo, setGeo] = useState<GeoState>({ kind: "idle" });

  // Both the position request and the lookup can answer long after the picker
  // has gone, and neither may write state into an unmounted component.
  const live = useRef(true);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => {
    live.current = true;
    return () => {
      live.current = false;
      abort.current?.abort();
    };
  }, []);

  /** Asks for permission, then turns the fix into a served area. */
  const detectArea = () => {
    if (!("geolocation" in navigator)) {
      setGeo({ kind: "unavailable" });
      return;
    }
    // Browsers only hand out coordinates over https (localhost aside), and
    // report the refusal as a plain position failure. Say so up front instead.
    if (!window.isSecureContext) {
      setGeo({ kind: "insecure" });
      return;
    }

    setResult({ kind: "unknown" });
    // The permission prompt goes up here; the browser blocks until answered.
    setGeo({ kind: "locating" });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!live.current) return;
        setGeo({ kind: "resolving" });

        abort.current?.abort();
        const controller = new AbortController();
        abort.current = controller;

        reverseGeocode(coords.latitude, coords.longitude, controller.signal)
          .then(({ matched, detected }) => {
            if (!live.current) return;

            if (matched) {
              setResult({ kind: "serviceable", area: matched });
              setGeo({ kind: "idle" });
            } else if (detected) {
              setResult({ kind: "unreachable", detected });
              setGeo({ kind: "idle" });
            } else {
              setGeo({ kind: "unnamed" });
            }
          })
          .catch((err: unknown) => {
            // An abort is us tearing down, not a failure worth reporting.
            if (!live.current || controller.signal.aborted) return;
            console.error("Reverse geocode failed", err);
            setGeo({ kind: "lookupFailed" });
          });
      },
      (err) => {
        if (!live.current) return;
        setGeo(
          err.code === err.PERMISSION_DENIED
            ? { kind: "denied" }
            : err.code === err.TIMEOUT
              ? { kind: "timeout" }
              : { kind: "unavailable" },
        );
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  };

  const busy = geo.kind === "locating" || geo.kind === "resolving";

  const value =
    geo.kind === "locating"
      ? "Finding you…"
      : geo.kind === "resolving"
        ? "Checking your area…"
        : result.kind === "serviceable"
          ? result.area
          : result.kind === "unreachable"
            ? result.detected
            : "Detect my area";

  // A delivery verdict outranks anything geolocation has to say about itself.
  const notice =
    result.kind === "serviceable"
      ? { tone: "ok" as const, text: `We deliver to ${result.area}.` }
      : result.kind === "unreachable"
        ? {
            tone: "bad" as const,
            text: `Unreachable — we don't deliver to “${result.detected}” yet. Currently serving ${AREAS.join(" and ")}.`,
          }
        : geo.kind === "unnamed"
          ? {
              tone: "info" as const,
              text: "We found you, but couldn't name your area. Try again.",
            }
          : geo.kind === "lookupFailed"
            ? {
                tone: "bad" as const,
                text: "Couldn't look up your area just now. Try again.",
              }
            : geo.kind === "denied"
              ? {
                  tone: "bad" as const,
                  // There is no typed fallback any more, so the only way
                  // forward is the browser's own permission control.
                  text: "Location permission is blocked. Allow location for this site in your browser, then try again.",
                }
              : geo.kind === "insecure"
                ? {
                    tone: "bad" as const,
                    text: "Location needs a secure (https) connection.",
                  }
                : geo.kind === "timeout"
                  ? {
                      tone: "bad" as const,
                      text: "Locating took too long. Try again.",
                    }
                  : geo.kind === "unavailable"
                    ? {
                        tone: "bad" as const,
                        text: "This device can't share a location.",
                      }
                    : null;

  return (
    <div className='lm-location'>
      <button
        type='button'
        className='lm-location__control'
        onClick={detectArea}
        disabled={busy}
        aria-describedby={notice ? noticeId : undefined}
      >
        <PinIcon className='lm-location__pin' />
        <span className='lm-location__field'>
          <span className='lm-location__label'>Deliver to</span>
          <span className='lm-location__value'>{value}</span>
        </span>
        <CrosshairIcon className='lm-location__locate-icon' aria-hidden='true' />
      </button>

      <p
        id={noticeId}
        className={
          notice
            ? `lm-location__msg lm-location__msg--${notice.tone}`
            : "lm-location__msg lm-visually-hidden"
        }
        role='status'
        aria-live='polite'
      >
        {notice?.text}
      </p>
    </div>
  );
}
