import { useId } from 'react';
import type { DietPlanItem } from '../../lib/api/dietPlan';
import { selectCartableItems } from '../../lib/cart';
import { Tag } from './Tag';

/** Rows shown before any results arrive, so the card keeps its height and
 *  nothing shifts when the matched items land. */
const PLACEHOLDER_ROWS = 4;

export function DietPlanResults({
  items,
  onQuantityChange,
}: {
  items: DietPlanItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
}) {
  const listId = useId();
  const hasItems = items.length > 0;

  const addAll = () => {
    // Nothing from the planner may be a medicine, but the cart rule is
    // applied here too so a matcher change can never bypass it.
    const cartable = selectCartableItems(items);
    // TODO(cart): hand `cartable` to the cart service once it exists.
    console.info('Add all to cart', cartable);
  };

  const sendToRation = () => {
    // TODO(ration): push these lines into the recurring ration schedule.
    console.info('Send to Daily Ration', items);
  };

  return (
    <div className="lm-results">
      <div className="lm-results__head">
        <h3 className="lm-results__title">Suggested from your plan</h3>
        <Tag tone="mint">AI MATCH</Tag>
      </div>

      <ul className="lm-results__list" id={listId}>
        {hasItems
          ? items.map((item) => (
              <li className="lm-results__row" key={item.productId}>
                <div className="lm-results__info">
                  <p className="lm-results__name">{item.name}</p>
                  <p className="lm-results__source">
                    &ldquo;{item.sourceText}&rdquo;
                  </p>
                </div>
                <div className="lm-results__qty">
                  <label
                    className="lm-visually-hidden"
                    htmlFor={`${listId}-${item.productId}`}
                  >
                    Quantity of {item.name} in {item.unit}
                  </label>
                  <input
                    id={`${listId}-${item.productId}`}
                    type="number"
                    min={0}
                    step={1}
                    inputMode="numeric"
                    value={item.quantity}
                    onChange={(e) =>
                      onQuantityChange(item.productId, Number(e.target.value))
                    }
                  />
                  <span className="lm-results__unit">{item.unit}</span>
                </div>
              </li>
            ))
          : Array.from({ length: PLACEHOLDER_ROWS }, (_, i) => (
              <li className="lm-results__row lm-results__row--empty" key={i}>
                <div className="lm-results__info">
                  <p className="lm-results__name">[PRODUCT]</p>
                  <p className="lm-results__source">[LINE FROM YOUR PLAN]</p>
                </div>
                <span className="lm-results__qty-placeholder">[QTY]</span>
              </li>
            ))}
      </ul>

      <div className="lm-results__actions">
        <button
          type="button"
          className="lm-btn lm-btn--mint"
          onClick={addAll}
          disabled={!hasItems}
        >
          Add all to cart
        </button>
        <button
          type="button"
          className="lm-btn lm-btn--onDark"
          onClick={sendToRation}
          disabled={!hasItems}
        >
          Send to Daily Ration
        </button>
      </div>
    </div>
  );
}
