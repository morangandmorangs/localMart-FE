import { Link } from "react-router-dom";

import { GET_APP_PATH } from "../../config/apps";

/**
 * The buy button on every product card. Orders are placed in the Local Mart
 * app, so it leads to the page that says where to get it. A sold-out item
 * keeps a disabled button, so the shelf still reads honestly.
 */
export function OrderInApp({
  soldOut,
  label,
}: {
  soldOut: boolean;
  /** Names the product for screen readers, e.g. "Tomato, 500 g". */
  label: string;
}) {
  if (soldOut) {
    return (
      <button className='lm-order' type='button' disabled>
        Sold out
      </button>
    );
  }

  return (
    <Link
      className='lm-order'
      to={GET_APP_PATH}
      aria-label={`Order ${label} in the Local Mart app`}
    >
      Order in app
    </Link>
  );
}
