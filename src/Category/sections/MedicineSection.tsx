import { PRESCRIPTION_UPLOAD_PATH } from "../../lib/catalog/categories";
import { resolveCartAction } from "../../lib/cart";
import { AlertIcon, UploadIcon } from "../../Home/components/Icons";
import { Tag } from "../../Home/components/Tag";
import { useCartDraft } from "../../lib/useCartDraft";
import { useGetProductsQuery } from "../../redux-store/Services/ProductApi";
import { ProductMedia } from "../components/ProductMedia";
import { QuantityControl } from "../components/QuantityControl";
import { StockLine } from "../components/StockLine";

/**
 * Medicine has two routes, and they are kept visibly apart.
 *
 * Anything needing a script starts at the upload panel so a pharmacist sees
 * it first; only the over-the-counter shelf below can be bought outright.
 * Every button here still goes through resolveCartAction, so an item that
 * later gains a requiresPrescription flag re-routes itself rather than
 * quietly becoming buyable.
 */
export function MedicineSection() {
  const cart = useCartDraft();
  const {
    data: medicines,
    isLoading,
    isError,
  } = useGetProductsQuery({ category: "medicine" });

  return (
    <>
      <section className='lm-catpage__section' aria-labelledby='lm-rx-title'>
        <div className='lm-rx-panel'>
          <div className='lm-rx-panel__head'>
            <h2 className='lm-rx-panel__title' id='lm-rx-title'>
              Prescription medicines
            </h2>
            <Tag tone='rx'>RX</Tag>
          </div>

          <p className='lm-rx-panel__text'>
            Upload a photo or PDF of your prescription. A licensed pharmacist
            checks it before anything is dispensed, and will call you if a
            substitution is needed.
          </p>

          <a className='lm-btn lm-btn--solid' href={PRESCRIPTION_UPLOAD_PATH}>
            <UploadIcon className='lm-btn__icon' />
            Upload prescription
          </a>

          <p className='lm-rx-panel__note'>
            <AlertIcon className='lm-rx-panel__note-icon' />
            <span>
              Prescription items are never added to the cart directly, and no
              substitution is made without your consent.
            </span>
          </p>
        </div>
      </section>

      <section className='lm-catpage__section' aria-labelledby='lm-otc-title'>
        <div className='lm-catpage__subhead'>
          <h2 className='lm-catpage__subtitle' id='lm-otc-title'>
            Over-the-counter
          </h2>
          <p className='lm-catpage__subnote'>No prescription needed here.</p>
        </div>

        {isLoading && (
          <p className='lm-catpage__subnote'>Loading over-the-counter…</p>
        )}
        {(isError || (!isLoading && !medicines)) && (
          <p className='lm-catpage__subnote'>
            Couldn't load over-the-counter medicine. Try again shortly.
          </p>
        )}

        <div className='lm-prod-grid'>
          {medicines?.map((med) => {
            const stock = med.stockCount ?? 0;
            const quantity = cart.quantityOf(med.id);
            const action = resolveCartAction({
              productId: med.id,
              name: med.name,
              requiresPrescription: med.requiresPrescription,
            });

            return (
              <article className='lm-prod' key={med.id}>
                <ProductMedia
                  src={med.image}
                  alt={med.name}
                  dimmed={stock === 0}
                />

                <h3 className='lm-prod__name'>{med.name}</h3>
                {med.useFor && <p className='lm-prod__meta'>{med.useFor}</p>}
                {med.pack && <p className='lm-prod__pack'>{med.pack}</p>}

                <div className='lm-prod__foot'>
                  <div>
                    <p className='lm-prod__price'>₹{med.price}</p>
                    <StockLine stockCount={stock} />
                  </div>

                  {action.kind === "prescription" ? (
                    // Defensive: nothing seeded under medicine is flagged
                    // today, but if one ever is, it must route and not sell.
                    <a className='lm-btn lm-btn--outline' href={action.href}>
                      {action.label}
                    </a>
                  ) : (
                    <QuantityControl
                      quantity={quantity}
                      max={stock}
                      label={med.name}
                      onIncrement={() => cart.increment(med.id, stock)}
                      onDecrement={() => cart.decrement(med.id)}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
