import { ProductShelf } from "../components/ProductShelf";

export function FreshSection() {
  return (
    <section className='lm-catpage__section' aria-label='Fresh produce'>
      <ProductShelf query={{ category: "livestock-vegetables" }} noun='fresh produce' />
    </section>
  );
}
