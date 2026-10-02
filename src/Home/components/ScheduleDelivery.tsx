import { useEffect, useId, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ALL_WORKDAYS,
  saveRationSchedule,
  WORKDAYS,
  type WeekDay,
} from "../../lib/api/ration";
import { formatCurrency } from "../../lib/api/wallet";
import { useWallet } from "../../hooks/useWallet";
import { selectIsAuthenticated } from "../../redux-store/Slices/authSlice";
import { WalletIcon } from "./Icons";

const describe = (days: WeekDay[]) =>
  days.length === ALL_WORKDAYS.length
    ? "Monday to Friday"
    : WORKDAYS.filter((d) => days.includes(d.key))
        .map((d) => d.full.slice(0, 3))
        .join(", ");

interface Props {
  /** Lets the header stay pinned while the panel is open. */
  onOpenChange?: (open: boolean) => void;
}

/** Wallet icon + "Schedule" in the header bar. Signed out, it sends the
 *  shopper to sign in; signed in, it opens the Monday–Friday food-delivery
 *  picker alongside the wallet balance. */
export function ScheduleDelivery({ onOpenChange }: Props) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const wallet = useWallet();

  const [open, setOpen] = useState(false);
  const [days, setDays] = useState<WeekDay[]>(ALL_WORKDAYS);
  const [saving, setSaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const setOpenState = (value: boolean) => {
    setOpen(value);
    onOpenChange?.(value);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => {
      setOpen(false);
      onOpenChange?.(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  const onSelect = () => {
    if (!isAuthenticated) {
      navigate(`/signin?redirect=${encodeURIComponent(pathname + search)}`);
      return;
    }
    setOpenState(!open);
  };

  const toggle = (day: WeekDay) =>
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const save = async () => {
    setSaving(true);
    try {
      await saveRationSchedule(days);
      toast.success(`Food delivery scheduled: ${describe(days)}`);
      setOpenState(false);
    } catch {
      toast.error("Could not save your delivery schedule");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='lm-schedule' ref={rootRef}>
      <button
        ref={buttonRef}
        type='button'
        className='lm-wallet-chip'
        aria-label='Schedule food delivery'
        aria-expanded={isAuthenticated ? open : undefined}
        aria-controls={isAuthenticated ? panelId : undefined}
        onClick={onSelect}
      >
        <WalletIcon className='lm-nav__icon' />
        <span>Schedule</span>
      </button>

      <div id={panelId} className='lm-schedule__panel' hidden={!open}>
        <p className='lm-schedule__title'>Schedule food delivery</p>
        <p className='lm-schedule__hint'>
          Monday to Friday · morning slot
          {wallet.kind === "ready" &&
            ` · Wallet ${formatCurrency(wallet.wallet.balanceMinor, wallet.wallet.currency)}`}
        </p>

        <div className='lm-days' role='group' aria-label='Delivery days'>
          {WORKDAYS.map((d) => (
            <button
              key={d.key}
              type='button'
              className='lm-days__btn'
              aria-pressed={days.includes(d.key)}
              onClick={() => toggle(d.key)}
            >
              <span aria-hidden='true'>{d.short}</span>
              <span className='lm-visually-hidden'>{d.full}</span>
            </button>
          ))}
        </div>

        <button
          type='button'
          className='lm-btn lm-btn--primary'
          disabled={days.length === 0 || saving}
          onClick={save}
        >
          {saving ? "Saving…" : "Save schedule"}
        </button>
      </div>
    </div>
  );
}
