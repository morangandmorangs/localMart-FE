import { useEffect, useState } from 'react';
import { formatCurrency, getWallet, type Wallet } from '../../lib/api/wallet';

type State =
  | { kind: 'loading' }
  | { kind: 'signedOut' }
  | { kind: 'ready'; wallet: Wallet }
  | { kind: 'error' };

export function WalletTile() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    getWallet()
      .then((res) => {
        if (cancelled) return;
        setState(
          res.signedIn && res.wallet
            ? { kind: 'ready', wallet: res.wallet }
            : { kind: 'signedOut' },
        );
      })
      .catch(() => {
        if (!cancelled) setState({ kind: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="lm-wallet">
      <p className="lm-wallet__label">LOCAL MART WALLET</p>

      <p className="lm-wallet__balance" aria-live="polite">
        {state.kind === 'loading' && (
          <span className="lm-skeleton" aria-label="Loading balance" />
        )}
        {state.kind === 'ready' &&
          formatCurrency(state.wallet.balanceMinor, state.wallet.currency)}
        {state.kind === 'signedOut' && (
          <a className="lm-wallet__signin" href="/signin">
            Sign in to view
          </a>
        )}
        {state.kind === 'error' && (
          <span className="lm-wallet__error">Balance unavailable</span>
        )}
      </p>

      <p className="lm-wallet__note">Auto-pays each delivery. Top up by UPI.</p>

      {/* TODO(payments): open the UPI top-up flow. No real payment here. */}
      <button type="button" className="lm-btn lm-btn--plan-outline">
        + Add money
      </button>
    </div>
  );
}
