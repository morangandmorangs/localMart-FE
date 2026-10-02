import type { AccountView } from "../accountTypes";
import { Card } from "./Card";

export const PartnerStatusCard = ({ account }: { account: AccountView }) => (
  <Card title='Partner status'>
    <dl className='divide-y divide-(--lm-line) text-sm'>
      <div className='flex justify-between gap-4 py-2'>
        <dt className='text-(--lm-muted)'>Profile</dt>
        <dd className='font-medium text-(--lm-brand-ink)'>
          {account.profileStatus ?? "Pending"}
        </dd>
      </div>
      <div className='flex justify-between gap-4 py-2'>
        <dt className='text-(--lm-muted)'>Can take orders</dt>
        <dd className='font-medium text-(--lm-brand-ink)'>
          {account.canOperate ? "Yes" : "Not yet"}
        </dd>
      </div>
    </dl>
  </Card>
);
