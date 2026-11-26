import { useState } from "react";

import type { Product } from "../../lib/catalog/types";
import { OrderInApp } from "./OrderInApp";
import { ProductMedia } from "./ProductMedia";
import { StockLine } from "./StockLine";

/**
 * One product. Produce sold by weight has sizes: pick one to see its price
 * and stock. A fixed pack (e.g. "1 kg", "5 kg bag") has one price and no
 * picker.
 *
 * Price and stock both belong to the chosen size, not the product, so they
 * re-read on every change — a shopper switching from 500 g to 1 kg must not
 * be shown the old price.
 */
export function ProductCard({
  product,
  showStock,
}: {
  product: Product;
  /** False while the catalogue has no stock connected: stock is unknown. */
  showStock: boolean;
}) {
  const variants = product.variants ?? [];
  // First size with stock, so the card doesn't open on a sold-out size.
  const [variantId, setVariantId] = useState(
    () => (variants.find((v) => v.stockCount > 0) ?? variants[0])?.id,
  );

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const price = variant ? variant.price : product.price;
  const stock = (variant ? variant.stockCount : product.stockCount) ?? 0;
  const soldOut = showStock && stock === 0;
  const label = variant ? `${product.name}, ${variant.label}` : product.name;

  return (
    <article className='lm-prod'>
      <ProductMedia src={product.image} alt={product.name} dimmed={soldOut} />

      <h3 className='lm-prod__name'>{product.name}</h3>
      {product.origin && <p className='lm-prod__meta'>{product.origin}</p>}
      {/* What an OTC medicine treats, so nobody guesses. */}
      {product.useFor && <p className='lm-prod__meta'>{product.useFor}</p>}
      {product.requiresPrescription && (
        <p className='lm-prod__meta'>Prescription needed</p>
      )}
      {!variant && product.pack && (
        <p className={product.useFor ? "lm-prod__pack" : "lm-prod__meta"}>
          {product.pack}
        </p>
      )}

      {variant && (
        <label className='lm-prod__pick'>
          <span className='lm-visually-hidden'>Size for {product.name}</span>
          <select
            className='lm-prod__select'
            value={variant.id}
            onChange={(e) => setVariantId(e.target.value)}
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label} — ₹{v.price}
                {showStock && v.stockCount === 0 ? " (sold out)" : ""}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className='lm-prod__foot'>
        <div>
          {price !== undefined && <p className='lm-prod__price'>₹{price}</p>}
          {showStock && <StockLine stockCount={stock} />}
        </div>
        <OrderInApp soldOut={soldOut} label={label} />
      </div>
    </article>
  );
}
