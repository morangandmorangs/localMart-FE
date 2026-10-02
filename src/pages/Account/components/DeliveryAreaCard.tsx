import type { AccountView } from "../accountTypes";
import { Card } from "./Card";

export const DeliveryAreaCard = ({ account }: { account: AccountView }) => (
  <Card title='Delivery area'>
    <p className='text-sm text-(--lm-brand-ink)'>
      {account.area ?? "Not set yet. Use “Detect my area” on the home page."}
    </p>
  </Card>
);
