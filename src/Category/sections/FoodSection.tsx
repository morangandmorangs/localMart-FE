import { RESTAURANTS } from "../../lib/catalog/products";
import { StarIcon } from "../components/StarIcon";

/**
 * Food is ordered from a kitchen, so this lists restaurants rather than
 * dishes — picking the kitchen comes before picking the meal, and a closed
 * kitchen has to be obvious before anyone builds an order in it.
 */
export function FoodSection() {
  return (
    <section className='lm-catpage__section' aria-label='Restaurants'>
      <ul className='lm-rest-list'>
        {RESTAURANTS.map((r) => (
          <li key={r.id}>
            <article className={`lm-rest${r.isOpen ? "" : " lm-rest--shut"}`}>
              <div className='lm-rest__media'>
                <img
                  className='lm-rest__img'
                  src={r.image}
                  alt={r.name}
                  loading='lazy'
                />
                {!r.isOpen && (
                  <span className='lm-rest__shut-tag'>Closed now</span>
                )}
              </div>

              <div className='lm-rest__body'>
                <div className='lm-rest__head'>
                  <h3 className='lm-rest__name'>{r.name}</h3>
                  <span
                    className='lm-rest__rating'
                    aria-label={`Rated ${r.rating} out of 5 from ${r.ratingCount} ratings`}
                  >
                    <StarIcon className='lm-rest__star' />
                    {r.rating}
                    <span className='lm-rest__rating-count'>
                      ({r.ratingCount})
                    </span>
                  </span>
                </div>

                <p className='lm-rest__cuisine'>{r.cuisine}</p>

                <ul className='lm-rest__dishes'>
                  {r.signatureDishes.map((dish) => (
                    <li key={dish} className='lm-chip'>
                      {dish}
                    </li>
                  ))}
                </ul>

                <div className='lm-rest__foot'>
                  <span>{r.prepMinutes} min</span>
                  <span aria-hidden='true'>·</span>
                  <span>₹{r.priceForTwo} for two</span>
                </div>
              </div>

              <div className='lm-rest__action'>
                {r.isOpen ? (
                  <a
                    className='lm-btn lm-btn--solid'
                    href={`/restaurant/${r.id}`}
                  >
                    View menu
                  </a>
                ) : (
                  <button className='lm-btn lm-btn--outline' type='button' disabled>
                    Closed
                  </button>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
