/** Below this, the card says how few are left instead of just "in stock".
 *  Matches LOW_STOCK_THRESHOLD in localMart-BEE. */
const LOW_STOCK_THRESHOLD = 10;

/**
 * How much is left.
 *
 * Three states rather than a number alone: sold out has to be unmissable,
 * and a low count is what actually makes someone order now. Each state
 * carries its own words, so none of them is conveyed by colour alone.
 */
export function StockLine({ stockCount }: { stockCount: number }) {
  if (stockCount === 0) {
    return <p className='lm-stock lm-stock--out'>Out of stock</p>;
  }
  if (stockCount <= LOW_STOCK_THRESHOLD) {
    return (
      <p className='lm-stock lm-stock--low'>Only {stockCount} left</p>
    );
  }
  return <p className='lm-stock'>{stockCount} in stock</p>;
}
