import { ProductShelf } from "../components/ProductShelf";

export function GrocerySection() {
  return (
    <section className='lm-catpage__section' aria-label='Grocery'>
      <ProductShelf query={{ category: "grocery" }} noun='grocery' />
    </section>
  );
}
