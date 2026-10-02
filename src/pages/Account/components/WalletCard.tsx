import { useWallet } from "../../../hooks/useWallet";
import { formatCurrency } from "../../../lib/api/wallet";
import { Card } from "./Card";

export const WalletCard = () => {
  const state = useWallet();

  return (
    <Card title='Wallet'>
      <p className='text-2xl font-semibold text-(--lm-brand-ink)'>
        {state.kind === "ready"
          ? formatCurrency(state.wallet.balanceMinor, state.wallet.currency)
          : state.kind === "loading"
            ? "…"
            : "—"}
      </p>
      {state.kind === "error" && (
        <p className='mt-1 text-sm text-(--lm-muted)'>
          Couldn’t load your balance just now.
        </p>
      )}
    </Card>
  );
};
