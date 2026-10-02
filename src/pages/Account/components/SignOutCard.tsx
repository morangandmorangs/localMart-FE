import type { AccountView } from "../accountTypes";
import { Card } from "./Card";

export const SignOutCard = ({ account }: { account: AccountView }) => (
  <Card>
    <button
      type='button'
      onClick={account.signOut}
      className='min-h-11 w-full cursor-pointer rounded-lg border border-(--lm-line) bg-white text-sm font-semibold text-(--lm-brand-ink) hover:bg-(--lm-tile)'
    >
      Sign out
    </button>
  </Card>
);
