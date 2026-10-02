import type { AccountView } from "../accountTypes";
import { Card } from "./Card";

export const ProfileCard = ({ account }: { account: AccountView }) => (
  <Card>
    <div className='flex items-center gap-4'>
      <span
        className='grid size-14 shrink-0 place-items-center rounded-full bg-(--lm-brand) text-xl font-semibold text-white'
        aria-hidden='true'
      >
        {account.name.charAt(0).toUpperCase()}
      </span>
      <div className='min-w-0'>
        <p className='truncate text-lg font-semibold text-(--lm-brand-ink)'>
          {account.name}
        </p>
        <span className='mt-1 inline-block rounded-full bg-(--lm-tile) px-2.5 py-0.5 text-xs font-semibold text-(--lm-brand-ink)'>
          {account.role}
        </span>
      </div>
    </div>
  </Card>
);
