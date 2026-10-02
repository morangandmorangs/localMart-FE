import type { ComponentType } from "react";
import { Navigate } from "react-router-dom";
import type { AccountRole, AccountView } from "./accountTypes";
import { DeliveryAreaCard } from "./components/DeliveryAreaCard";
import { DetailsCard } from "./components/DetailsCard";
import { PartnerStatusCard } from "./components/PartnerStatusCard";
import { ProfileCard } from "./components/ProfileCard";
import { QuickLinksCard } from "./components/QuickLinksCard";
import { SignOutCard } from "./components/SignOutCard";
import { WalletCard } from "./components/WalletCard";
import { useAccountView } from "./useAccountView";

type Section = ComponentType<{ account: AccountView }>;

/** Which mini components each role sees, in order. Adding a role or a card is
 *  one line here; the page itself never branches on role. */
const SECTIONS: Record<AccountRole, Section[]> = {
  Customer: [
    ProfileCard,
    DetailsCard,
    DeliveryAreaCard,
    WalletCard,
    QuickLinksCard,
    SignOutCard,
  ],
  Merchant: [
    ProfileCard,
    DetailsCard,
    PartnerStatusCard,
    QuickLinksCard,
    SignOutCard,
  ],
  Driver: [
    ProfileCard,
    DetailsCard,
    PartnerStatusCard,
    QuickLinksCard,
    SignOutCard,
  ],
  Admin: [ProfileCard, DetailsCard, QuickLinksCard, SignOutCard],
};

/** /account for every role: one shell, role-specific mini components. */
export default function AccountPage() {
  const account = useAccountView();
  if (!account) return <Navigate to='/signin?redirect=%2Faccount' replace />;

  return (
    <main className='min-h-dvh bg-(--lm-page) px-(--lm-gutter) py-6'>
      <div className='mx-auto flex max-w-xl flex-col gap-4'>
        <h1 className='text-xl font-semibold text-(--lm-brand-ink)'>
          My account
        </h1>
        {SECTIONS[account.role].map((Section, i) => (
          <Section key={i} account={account} />
        ))}
      </div>
    </main>
  );
}
