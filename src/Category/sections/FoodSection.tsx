import { Link } from "react-router-dom";

import { useGetRestaurantsQuery } from "../../redux-store/Services/ProductApi";
import { StarIcon } from "../components/StarIcon";

/**
 * Food is ordered from a kitchen, so this lists restaurants rather than
 * dishes — picking the kitchen comes before picking the meal, and a closed
 * kitchen has to be obvious before anyone builds an order in it.
 */
export function FoodSection() {
  const { data: restaurants, isLoading, isError } = useGetRestaurantsQuery();

  if (isLoading) {
    return <p className='lm-catpage__subnote'>Loading kitchens…</p>;
  }
  if (isError || !restaurants) {
    return (
      <p className='lm-catpage__subnote'>
        Couldn't load kitchens. Try again shortly.
      </p>
    );
  }
  if (restaurants.length === 0) {
    return <p className='lm-catpage__subnote'>No kitchens are listed yet.</p>;
  }

  return (
    <section className='lm-catpage__section' aria-label='Restaurants'>
      <ul className='lm-rest-list'>
        {restaurants.map((r) => (
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
                  <Link className='lm-btn lm-btn--primary' to={`/restaurant/${r.id}`}>
                    View kitchen
                  </Link>
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
