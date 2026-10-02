import { Link, useParams } from "react-router-dom";

import { Footer } from "../Home/components/Footer";
import { Header } from "../Home/components/Header";
import { RESTAURANTS } from "../lib/catalog/products";
import "./Category.css";

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const r = RESTAURANTS.find((x) => x.id === id);

  return (
    <div className='lm-home'>
      <Header />
      <main className='lm-main'>
        {!r ? (
          <section className='lm-catpage__missing'>
            <h1>Restaurant not found</h1>
            <p>
              Browse the <Link to='/category/food'>food aisle</Link> instead.
            </p>
          </section>
        ) : (
          <section className='lm-catpage__section' aria-label={r.name}>
            <h1 className='lm-catpage__title'>{r.name}</h1>
            <p className='lm-rest__cuisine'>{r.cuisine}</p>
            <p>
              ★ {r.rating} ({r.ratingCount}) · {r.prepMinutes} min · ₹
              {r.priceForTwo} for two
              {r.isOpen ? "" : " · Closed now"}
            </p>
            <h2>Signature dishes</h2>
            <ul className='lm-rest__dishes'>
              {r.signatureDishes.map((dish) => (
                <li key={dish} className='lm-chip'>
                  {dish}
                </li>
              ))}
            </ul>
            <p>
              <Link to='/category/food'>Back to all restaurants</Link>
            </p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
