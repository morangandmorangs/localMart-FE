import { useGetProductsQuery } from "../../redux-store/Services/ProductApi";
import { ProductCard } from "./ProductCard";

/**
 * A grid of products from GET /api/products, with its loading, error and
 * empty states. `noun` names what is on the shelf in those messages, e.g.
 * "fresh produce".
 */
export function ProductShelf({
  query,
  noun,
}: {
  query: { category?: string; search?: string };
  noun: string;
}) {
  const { data, isLoading, isError } = useGetProductsQuery(query);

  if (isLoading) {
    return <p className='lm-catpage__subnote'>Loading {noun}…</p>;
  }
  if (isError || !data) {
    return (
      <p className='lm-catpage__subnote'>
        Couldn't load {noun}. Try again shortly.
      </p>
    );
  }
  if (data.products.length === 0) {
    return <p className='lm-catpage__subnote'>No {noun} available right now.</p>;
  }

  return (
    <div className='lm-prod-grid'>
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} showStock={data.showStock} />
      ))}
    </div>
  );
}
