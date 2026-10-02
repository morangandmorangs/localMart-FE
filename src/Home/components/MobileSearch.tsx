import { useEffect, useRef, useState } from "react";
import { CloseIcon, MicIcon, SearchIcon } from "./Icons";

/** The Web Speech API is still prefixed in Chromium/Safari and absent from the
 *  DOM lib typings, so only the slice used here is declared. */
interface Recognition {
  lang: string;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type RecognitionCtor = new () => Recognition;

const getRecognition = (): RecognitionCtor | undefined => {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

/**
 * Mobile-only search. At rest it is a floating button, bottom-right; tapping
 * it opens a search bar with mic and search buttons. Both are fixed, so they
 * stay put while the page scrolls.
 */
export function MobileSearch() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [query, setQuery] = useState("");
  const recognition = useRef<Recognition | null>(null);
  const speechSupported = typeof window !== "undefined" && !!getRecognition();

  useEffect(() => () => recognition.current?.stop(), []);

  // The on-screen keyboard overlays fixed elements (iOS always, Android
  // Chrome by default), which would hide the bar. Lift it by however much of
  // the layout viewport the visual viewport has lost to the keyboard.
  const [keyboard, setKeyboard] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!open || !vv) return;
    const update = () =>
      setKeyboard(Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)));
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      setKeyboard(0);
    };
  }, [open]);

  // Escape closes the bar, as it does the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggleMic = () => {
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const Ctor = getRecognition();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.onresult = (e) => setQuery(e.results[0]?.[0]?.transcript ?? "");
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognition.current = rec;
    setListening(true);
    rec.start();
  };

  // Keeps focus in the input when a button is pressed, so the bar doesn't
  // collapse (blur) before the click lands.
  const keepFocus = (e: React.PointerEvent) => e.preventDefault();

  const action =
    "grid size-9 shrink-0 place-items-center rounded-[10px] text-(--lm-brand-ink) active:bg-(--lm-tile)";

  return (
    <div className='hidden max-[768px]:contents'>
      {open ? (
        <form
          className='fixed inset-x-(--lm-gutter) bottom-(--lm-gutter) z-50 flex min-h-12 items-center gap-1 rounded-full border border-(--lm-line) bg-white pr-1.5 pl-4 shadow-[0_10px_24px_rgba(15,59,44,0.24)] focus-within:border-(--lm-brand)'
          style={{ marginBottom: keyboard }}
          action='/search'
          method='get'
          role='search'
        >
          <input
            autoFocus
            className='min-w-0 flex-1 bg-transparent text-sm font-light text-(--lm-brand-ink) outline-none placeholder:text-(--lm-muted)'
            type='search'
            name='q'
            aria-label='Search any items'
            autoComplete='off'
            placeholder={listening ? "Listening…" : "Search vegetables, rice, fish…"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              if (!listening && !query) setOpen(false);
            }}
          />
          <button
            type='button'
            className={`${action} ${listening ? "bg-(--lm-brand) text-white active:bg-(--lm-brand)" : ""}`}
            aria-label={listening ? "Stop voice search" : "Search by voice"}
            aria-pressed={listening}
            disabled={!speechSupported}
            onPointerDown={keepFocus}
            onClick={toggleMic}
          >
            <MicIcon className='size-5' />
          </button>
          <button type='submit' className={action} aria-label='Search' onPointerDown={keepFocus}>
            <SearchIcon className='size-5' />
          </button>
          <button
            type='button'
            className={action}
            aria-label='Close search'
            onPointerDown={keepFocus}
            onClick={() => {
              recognition.current?.stop();
              setOpen(false);
            }}
          >
            <CloseIcon className='size-5' />
          </button>
        </form>
      ) : (
        <button
          type='button'
          className='fixed right-(--lm-gutter) bottom-(--lm-gutter) z-50 grid size-14 place-items-center rounded-full border border-(--lm-brand-deep) bg-(--lm-brand) text-white shadow-[0_10px_24px_rgba(15,59,44,0.24)]'
          aria-label='Search'
          onClick={() => setOpen(true)}
        >
          <SearchIcon className='size-6' />
        </button>
      )}
    </div>
  );
}
