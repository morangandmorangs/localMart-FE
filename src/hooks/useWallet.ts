import { useEffect, useState } from "react";
import { getWallet, type Wallet } from "../lib/api/wallet";

export type WalletState =
  | { kind: "loading" }
  | { kind: "signedOut" }
  | { kind: "ready"; wallet: Wallet }
  | { kind: "error" };

/** Shared by the header chip and the ration wallet tile. */
export const useWallet = (): WalletState => {
  const [state, setState] = useState<WalletState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    getWallet()
      .then((res) => {
        if (cancelled) return;
        setState(
          res.signedIn && res.wallet
            ? { kind: "ready", wallet: res.wallet }
            : { kind: "signedOut" },
        );
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
