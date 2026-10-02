import type { AccountView } from "../accountTypes";
import { Card } from "./Card";

export const DetailsCard = ({ account }: { account: AccountView }) => {
  const rows: [string, string | undefined][] = [
    [account.identifierLabel, account.identifier],
    ["Designation", account.designation],
  ];

  return (
    <Card title='Details'>
      <dl className='divide-y divide-(--lm-line)'>
        {rows
          .filter((row): row is [string, string] => Boolean(row[1]))
          .map(([label, value]) => (
            <div key={label} className='flex justify-between gap-4 py-2 text-sm'>
              <dt className='text-(--lm-muted)'>{label}</dt>
              <dd className='font-medium break-all text-(--lm-brand-ink)'>
                {value}
              </dd>
            </div>
          ))}
      </dl>
    </Card>
  );
};
