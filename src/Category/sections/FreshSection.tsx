import { useState } from "react";

import type { Product } from "../../lib/catalog/types";
import { useCartDraft } from "../../lib/useCartDraft";
import { useGetProductsQuery } from "../../redux-store/Services/ProductApi";
import { ProductMedia } from "../components/ProductMedia";
import { QuantityControl } from "../components/QuantityControl";
import { StockLine } from "../components/StockLine";

/**
 * One fresh item: pick a size, then add.
 *
 * Price and stock both belong to the chosen variant, not the product, so
 * they re-read on every change — a shopper switching from 500 g to 1 kg must
 * not be shown the old price.
 */
function FreshCard({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  // First variant with stock, so the card doesn't open on a sold-out size.
  const [variantId, setVariantId] = useState(
    () => (variants.find((v) => v.stockCount > 0) ?? variants[0])?.id,
  );
  const cart = useCartDraft();

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  if (!variant) return null;

  const quantity = cart.quantityOf(product.id, variant.id);
  const label = `${product.name}, ${variant.label}`;

  return (
    <article className='lm-prod'>
      <ProductMedia
        src={product.image}
        alt={product.name}
        dimmed={variant.stockCount === 0}
      />

      <h3 className='lm-prod__name'>{product.name}</h3>
      {product.origin && <p className='lm-prod__meta'>{product.origin}</p>}

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
              {v.stockCount === 0 ? " (sold out)" : ""}
            </option>
          ))}
        </select>
      </label>

      <div className='lm-prod__foot'>
        <div>
          <p className='lm-prod__price'>₹{variant.price}</p>
          <StockLine stockCount={variant.stockCount} />
        </div>
        <QuantityControl
          quantity={quantity}
          max={variant.stockCount}
          label={label}
          onIncrement={() =>
            cart.increment(product.id, variant.stockCount, variant.id)
          }
          onDecrement={() => cart.decrement(product.id, variant.id)}
        />
      </div>
    </article>
  );
}

export function FreshSection() {
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery({ category: "livestock-vegetables" });

  if (isLoading) {
    return <p className='lm-catpage__subnote'>Loading fresh produce…</p>;
  }
  if (isError || !products) {
    return (
      <p className='lm-catpage__subnote'>
        Couldn't load fresh produce. Try again shortly.
      </p>
    );
  }

  return (
    <section className='lm-catpage__section' aria-label='Fresh produce'>
      <div className='lm-prod-grid'>
        {products.map((product) => (
          <FreshCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
