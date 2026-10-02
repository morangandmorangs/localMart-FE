/**
 * The add control: a bare plus until something is in the cart, then a
 * stepper.
 *
 * Collapsing to one button keeps the grid calm, and the plus is the whole
 * target rather than a small icon inside a wider row.
 */
export function QuantityControl({
  quantity,
  max,
  disabled = false,
  label,
  onIncrement,
  onDecrement,
}: {
  quantity: number;
  /** Stock on hand; the plus stops here. */
  max: number;
  disabled?: boolean;
  /** Names the product for screen readers, e.g. "Tomato, 500 g". */
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  if (disabled || max === 0) {
    return (
      <button className='lm-qty__add' type='button' disabled>
        Sold out
      </button>
    );
  }

  if (quantity === 0) {
    return (
      <button
        className='lm-qty__add'
        type='button'
        onClick={onIncrement}
        aria-label={`Add ${label}`}
      >
        <span aria-hidden='true'>+</span>
        <span className='lm-qty__add-text'>Add</span>
      </button>
    );
  }

  return (
    <div className='lm-qty' role='group' aria-label={`Quantity, ${label}`}>
      <button
        className='lm-qty__btn'
        type='button'
        onClick={onDecrement}
        aria-label={`Remove one ${label}`}
      >
        <span aria-hidden='true'>−</span>
      </button>
      <span className='lm-qty__count' aria-live='polite'>
        {quantity}
      </span>
      <button
        className='lm-qty__btn'
        type='button'
        onClick={onIncrement}
        disabled={quantity >= max}
        aria-label={`Add one more ${label}`}
      >
        <span aria-hidden='true'>+</span>
      </button>
    </div>
  );
}
