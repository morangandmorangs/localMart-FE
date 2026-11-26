import { useSearchParams } from "react-router-dom";

import { ProductShelf } from "../../Category/components/ProductShelf";
import { Footer } from "../../Home/components/Footer";
import { Header } from "../../Home/components/Header";

/** Results for the header search (GET /search?q=…), from the products API. */
export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q")?.trim() ?? "";

  return (
    <div className='lm-home'>
      <Header />
      <main className='lm-main'>
        <header className='lm-catpage__head'>
          <div>
            <h1 className='lm-catpage__title'>
              {q ? `Results for “${q}”` : "Search"}
            </h1>
            {!q && (
              <p className='lm-catpage__subtitle'>
                Type what you're looking for in the search box above.
              </p>
            )}
          </div>
        </header>

        {q && (
          <section className='lm-catpage__section' aria-label='Search results'>
            <ProductShelf query={{ search: q }} noun={`products matching “${q}”`} />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
