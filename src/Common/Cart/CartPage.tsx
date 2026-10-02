import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ProductMedia } from "../../Category/components/ProductMedia";
import { QuantityControl } from "../../Category/components/QuantityControl";
import { Footer } from "../../Home/components/Footer";
import { Header } from "../../Home/components/Header";
import { useCartDraft } from "../../lib/useCartDraft";
import { useGetProductsQuery } from "../../redux-store/Services/ProductApi";
import { selectIsAuthenticated } from "../../redux-store/Slices/authSlice";
import {
  selectCartLines,
  selectTotalItems,
} from "../../redux-store/Slices/cartSlice";

export default function CartPage() {
  const navigate = useNavigate();
  const cart = useCartDraft();
  const lines = useSelector(selectCartLines);
  const totalItems = useSelector(selectTotalItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: products, isLoading } = useGetProductsQuery();

  const rows = useMemo(() => {
    if (!products) return [];
    return Object.values(lines)
      .map((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return null;
        const variant = line.variantId
          ? product.variants?.find((v) => v.id === line.variantId)
          : undefined;
        const price = variant ? variant.price : (product.price ?? 0);
        const stock = variant ? variant.stockCount : (product.stockCount ?? 0);
        const name = variant
          ? `${product.name}, ${variant.label}`
          : product.name;
        return { line, product, price, stock, name };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
  }, [lines, products]);

  const subtotal = rows.reduce((sum, r) => sum + r.price * r.line.quantity, 0);

  const onCheckout = () => {
    navigate(isAuthenticated ? "/checkout" : "/signin?redirect=/checkout");
  };

  return (
    <div className='lm-home'>
      <Header />

      <main className='lm-main'>
        <header className='lm-catpage__head'>
          <div>
            <h1 className='lm-catpage__title'>Your cart</h1>
            <p className='lm-catpage__subtitle'>
              {totalItems === 0
                ? "Nothing in here yet."
                : `${totalItems} ${totalItems === 1 ? "item" : "items"}`}
            </p>
          </div>
        </header>

        <section className='lm-catpage__section'>
          {isLoading ? (
            <p className='lm-catpage__subnote'>Loading your cart…</p>
          ) : rows.length === 0 ? (
            <p className='lm-catpage__subnote'>
              Your cart is empty. <a href='/'>Go shopping</a>.
            </p>
          ) : (
            <>
              <ul className='lm-cartpage__list'>
                {rows.map(({ line, product, price, stock, name }) => (
                  <li
                    className='lm-cartpage__row'
                    key={`${line.productId}::${line.variantId ?? ""}`}
                  >
                    <ProductMedia src={product.image} alt={product.name} />
                    <div className='lm-cartpage__row-body'>
                      <p className='lm-prod__name'>{name}</p>
                      <p className='lm-prod__price'>₹{price}</p>
                    </div>
                    <QuantityControl
                      quantity={line.quantity}
                      max={stock}
                      label={name}
                      onIncrement={() =>
                        cart.increment(line.productId, stock, line.variantId)
                      }
                      onDecrement={() =>
                        cart.decrement(line.productId, line.variantId)
                      }
                    />
                  </li>
                ))}
              </ul>

              <div className='lm-cartpage__summary'>
                <p className='lm-cartpage__subtotal'>Subtotal: ₹{subtotal}</p>
                <button
                  className='lm-btn lm-btn--primary'
                  type='button'
                  onClick={onCheckout}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
