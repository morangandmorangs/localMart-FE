export interface Wallet {
  /** Minor units (paise). Money is integer-only — never a float. */
  balanceMinor: number;
  currency: 'INR';
}

export interface WalletResponse {
  signedIn: boolean;
  wallet: Wallet | null;
}

/**
 * TODO(api): swap for GET /api/wallet, reading the signed-in customer's
 * balance. Until a customer session exists this resolves signed-out, so the
 * tile shows its "Sign in to view" state after the loading skeleton.
 */
export function getWallet(): Promise<WalletResponse> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve({ signedIn: false, wallet: null }), 600);
  });
}

/** One formatter, one rounding rule, everywhere a balance appears. */
export function formatCurrency(minor: number, currency: Wallet['currency']) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(minor / 100);
}
