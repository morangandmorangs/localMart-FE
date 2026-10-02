/**
 * Product photo. Placeholders live in /public/mock today; the box is sized
 * here so swapping in a real photograph changes nothing around it.
 */
export function ProductMedia({
  src,
  alt,
  dimmed = false,
}: {
  src: string;
  alt: string;
  /** Sold-out items are greyed so the state reads before the label does. */
  dimmed?: boolean;
}) {
  return (
    <div className={`lm-pm${dimmed ? " lm-pm--dimmed" : ""}`}>
      <img className='lm-pm__img' src={src} alt={alt} loading='lazy' />
    </div>
  );
}
