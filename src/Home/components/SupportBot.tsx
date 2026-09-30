import { useEffect, useId, useRef, useState } from 'react';
import {
  SUPPORT_HUMAN,
  SUPPORT_OPENING_TOPICS,
  askSupportBot,
  supportTopicById,
  type SupportMessage,
} from '../../lib/api/support';
import { ArrowRightIcon, CloseIcon, SupportIcon } from './Icons';

const GREETING: SupportMessage = {
  id: 'greeting',
  from: 'bot',
  text: "Hi — support bot here. Ask about delivery, an order, your ration plan or the wallet, or pick a topic below.",
};

let seq = 0;
const nextId = () => `m${++seq}`;

/** Floating support bot. Sits bottom-right on top of the page, collapsed to a
 *  button until opened; the /support page is still the route for anything the
 *  bot can't answer. */
export function SupportBot() {
  const panelId = useId();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([GREETING]);
  const [followUps, setFollowUps] = useState<string[]>(SUPPORT_OPENING_TOPICS);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);

  const fabRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Close on Escape and return focus to the button that opened the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Focus the field on open so a keyboard user can type straight away.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, thinking]);

  const ask = (question: string) => {
    const text = question.trim();
    if (!text || thinking) return;
    setMessages((prev) => [
      ...prev,
      { id: nextId(), from: 'customer', text },
    ]);
    setFollowUps([]);
    setDraft('');
    setThinking(true);
    askSupportBot(text).then((reply) => {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), from: 'bot', text: reply.text },
      ]);
      setFollowUps(reply.followUps);
      setThinking(false);
      inputRef.current?.focus();
    });
  };

  return (
    <div className="lm-support">
      <div
        id={panelId}
        className="lm-support__panel"
        role="dialog"
        aria-labelledby={titleId}
        hidden={!open}
      >
        <div className="lm-support__head">
          <SupportIcon className="lm-support__head-icon" />
          <div>
            <p className="lm-support__title" id={titleId}>
              Support
            </p>
            <p className="lm-support__sub">
              Answers now · people on {SUPPORT_HUMAN.phone}
            </p>
          </div>
          <button
            type="button"
            className="lm-support__close"
            aria-label="Close support"
            onClick={() => {
              setOpen(false);
              fabRef.current?.focus();
            }}
          >
            <CloseIcon />
          </button>
        </div>

        <div
          className="lm-support__log"
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label="Support conversation"
        >
          {messages.map(({ id, from, text }) => (
            <p key={id} className={`lm-support__msg lm-support__msg--${from}`}>
              {text}
            </p>
          ))}
          {thinking && (
            <p className="lm-support__msg lm-support__msg--bot lm-support__msg--wait">
              Checking…
            </p>
          )}
        </div>

        {followUps.length > 0 && !thinking && (
          <div className="lm-support__topics">
            {followUps.map((id) => {
              const topic = supportTopicById(id);
              if (!topic) return null;
              return (
                <button
                  key={id}
                  type="button"
                  className="lm-support__topic"
                  onClick={() => ask(topic.label)}
                >
                  {topic.label}
                </button>
              );
            })}
          </div>
        )}

        <form
          className="lm-support__form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
        >
          <input
            ref={inputRef}
            className="lm-support__input"
            type="text"
            value={draft}
            placeholder="Type your question"
            aria-label="Your question"
            autoComplete="off"
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            type="submit"
            className="lm-support__send"
            aria-label="Send question"
            disabled={thinking || draft.trim() === ''}
          >
            <ArrowRightIcon className="lm-support__send-icon" />
          </button>
        </form>

        <p className="lm-support__foot">
          Not what you needed? <a href="/support">Open the Support page</a> —
          {' '}we reply within one working day.
        </p>
      </div>

      <button
        ref={fabRef}
        type="button"
        className="lm-support__fab"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <CloseIcon className="lm-support__fab-icon" />
        ) : (
          <SupportIcon className="lm-support__fab-icon" />
        )}
        <span className="lm-support__fab-label">
          {open ? 'Close' : 'Support'}
        </span>
      </button>
    </div>
  );
}
