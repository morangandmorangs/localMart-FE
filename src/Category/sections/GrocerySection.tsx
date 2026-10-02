import { useCartDraft } from "../../lib/useCartDraft";
import { useGetProductsQuery } from "../../redux-store/Services/ProductApi";
import { ProductMedia } from "../components/ProductMedia";
import { StockLine } from "../components/StockLine";

/**
 * Grocery is fixed packs — one size, one price — so the card carries a
 * spelled-out "Add to cart" rather than the fresh page's bare plus. Once
 * something is in the basket it becomes a stepper, same as fresh.
 */
export function GrocerySection() {
  const cart = useCartDraft();
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery({ category: "grocery" });

  if (isLoading) {
    return <p className='lm-catpage__subnote'>Loading grocery…</p>;
  }
  if (isError || !products) {
    return (
      <p className='lm-catpage__subnote'>
        Couldn't load grocery. Try again shortly.
      </p>
    );
  }

  return (
    <section className='lm-catpage__section' aria-label='Grocery'>
      <div className='lm-prod-grid'>
        {products.map((product) => {
          const stock = product.stockCount ?? 0;
          const quantity = cart.quantityOf(product.id);
          const soldOut = stock === 0;

          return (
            <article className='lm-prod' key={product.id}>
              <ProductMedia
                src={product.image}
                alt={product.name}
                dimmed={soldOut}
              />

              <h3 className='lm-prod__name'>{product.name}</h3>
              {product.pack && (
                <p className='lm-prod__meta'>{product.pack}</p>
              )}

              <div className='lm-prod__foot'>
                <div>
                  <p className='lm-prod__price'>₹{product.price}</p>
                  <StockLine stockCount={stock} />
                </div>

                {soldOut ? (
                  <button className='lm-btn lm-btn--outline' type='button' disabled>
                    Sold out
                  </button>
                ) : quantity === 0 ? (
                  <button
                    className='lm-btn lm-btn--solid'
                    type='button'
                    onClick={() => cart.increment(product.id, stock)}
                  >
                    Add to cart
                  </button>
                ) : (
                  <div
                    className='lm-qty'
                    role='group'
                    aria-label={`Quantity, ${product.name}`}
                  >
                    <button
                      className='lm-qty__btn'
                      type='button'
                      onClick={() => cart.decrement(product.id)}
                      aria-label={`Remove one ${product.name}`}
                    >
                      <span aria-hidden='true'>−</span>
                    </button>
                    <span className='lm-qty__count' aria-live='polite'>
                      {quantity}
                    </span>
                    <button
                      className='lm-qty__btn'
                      type='button'
                      onClick={() => cart.increment(product.id, stock)}
                      disabled={quantity >= stock}
                      aria-label={`Add one more ${product.name}`}
                    >
                      <span aria-hidden='true'>+</span>
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
