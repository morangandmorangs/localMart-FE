import { Link } from "react-router-dom";
import type { AccountRole, AccountView } from "../accountTypes";
import { Card } from "./Card";

const LINKS: Record<AccountRole, { to: string; label: string }[]> = {
  Customer: [
    { to: "/cart", label: "My cart" },
    { to: "/", label: "Keep shopping" },
  ],
  Admin: [{ to: "/admin/dashboard", label: "Admin dashboard" }],
  Merchant: [{ to: "/", label: "Storefront" }],
  Driver: [{ to: "/", label: "Home" }],
};

export const QuickLinksCard = ({ account }: { account: AccountView }) => (
  <Card title='Quick links'>
    <ul className='flex flex-col gap-1'>
      {LINKS[account.role].map(({ to, label }) => (
        <li key={to}>
          <Link
            to={to}
            className='block rounded-lg px-2 py-2 text-sm font-medium text-(--lm-brand) hover:bg-(--lm-tile)'
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </Card>
);
