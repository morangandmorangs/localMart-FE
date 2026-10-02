import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { QuantityControl } from "../Category/components/QuantityControl";
import {
  DAILY_KCAL,
  DAILY_MEALS,
  PLAN_DAYS,
  generateMonthlyPlan,
} from "./leanBulkPlan";

/** Suggested 1-month Lean Bulk basket. Quantities start at the suggestion;
 *  the shopper can only reduce (or re-add up to it), then check out. */
export function MonthlyPlanCart({ isAuthenticated }: { isAuthenticated: boolean }) {
  const navigate = useNavigate();
  const items = useMemo(() => generateMonthlyPlan(), []);
  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(items.map((i) => [i.id, i.suggested])),
  );

  const change = (id: string, delta: number, max: number) =>
    setQty((q) => ({
      ...q,
      [id]: Math.min(max, Math.max(0, (q[id] ?? 0) + delta)),
    }));

  const chosen = items.filter((i) => (qty[i.id] ?? 0) > 0);
  const total = chosen.reduce((s, i) => s + i.price * qty[i.id], 0);
  const count = chosen.reduce((s, i) => s + qty[i.id], 0);

  const onCheckout = () => {
    const plan = chosen.map((i) => ({ id: i.id, name: i.name, quantity: qty[i.id], price: i.price }));
    navigate(isAuthenticated ? "/checkout" : "/signin?redirect=/checkout", {
      state: { plan },
    });
  };

  return (
    <section className='lm-catpage__section lm-plan'>
      <header className='lm-plan__head'>
        <h2 className='lm-catpage__title'>Suggested for you · {PLAN_DAYS}-day Lean Bulk</h2>
        <p className='lm-catpage__subtitle'>
          ~{DAILY_KCAL} kcal/day across {DAILY_MEALS.length} meals. Everything you need for a month, sized to the plan. Reduce anything you already have.
        </p>
      </header>

      <ul className='lm-plan__meals'>
        {DAILY_MEALS.map((m) => (
          <li key={m.name}>
            <strong>{m.name}</strong> · {m.kcal} kcal
            <span>{m.items}</span>
          </li>
        ))}
      </ul>

      <ul className='lm-cartpage__list'>
        {items.map((i) => (
          <li className='lm-cartpage__row lm-plan__row' key={i.id}>
            <span className='lm-plan__emoji' aria-hidden='true'>{i.emoji}</span>
            <div className='lm-cartpage__row-body'>
              <p className='lm-prod__name'>{i.name}, {i.pack}</p>
              <p className='lm-prod__price'>
                ₹{i.price} · {i.meal} · suggested {i.suggested}
              </p>
            </div>
            <QuantityControl
              quantity={qty[i.id] ?? 0}
              max={i.suggested}
              label={i.name}
              onIncrement={() => change(i.id, 1, i.suggested)}
              onDecrement={() => change(i.id, -1, i.suggested)}
            />
          </li>
        ))}
      </ul>

      <div className='lm-cartpage__summary'>
        <p className='lm-cartpage__subtotal'>
          {count} packs · ₹{total}
        </p>
        <button
          className='lm-btn lm-btn--primary'
          type='button'
          disabled={count === 0}
          onClick={onCheckout}
        >
          Checkout plan
        </button>
      </div>
    </section>
  );
}
