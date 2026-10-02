import { Link } from "react-router-dom";
import { CATEGORIES, categoryPath } from "../../lib/catalog/categories";
import { ArrowRightIcon, CalendarIcon, GiftIcon, SparkleIcon } from "./Icons";
import { Tag } from "./Tag";

/** The white card on the right of the hero: four shop tiles, then the
 *  AI + planning shortcuts. Data comes from the catalogue config. */
export function CategoryQuickCard() {
  return (
    <div className='lm-quick'>
      <div className='lm-quick__head'>
        <h2 className='lm-quick__title'>Shop by category</h2>
        <Tag>SHOP</Tag>
      </div>

      <ul className='lm-quick__tiles'>
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <a
              className={`lm-quick__tile${c.family === "rx" ? " lm-quick__tile--rx" : ""}`}
              href={categoryPath(c.slug)}
            >
              <span className='lm-quick__thumb'>
                <img src={c.image} alt={c.title} loading='lazy' />
                <span className='lm-quick__badge'>{c.tileLabel}</span>
              </span>
              <span className='lm-quick__name'>{c.title}</span>
            </a>
          </li>
        ))}
      </ul>

      <hr className='lm-quick__rule' />

      <div className='lm-quick__head'>
        <h2 className='lm-quick__title'>Plan smarter</h2>
        <Tag>AI + PLANNING</Tag>
      </div>

      <Link className='lm-quick__ai' to='/ai-diet-planner'>
        <span className='lm-quick__ai-mark'>
          <SparkleIcon />
        </span>
        <span className='lm-quick__ai-body'>
          <span className='lm-quick__ai-title'>
            AI Diet Planner <Tag tone='mint'>AI</Tag>
          </span>
          <span className='lm-quick__ai-text'>
            Upload a diet plan, get a ready-to-order list
          </span>
        </span>
        <ArrowRightIcon className='lm-quick__ai-arrow' />
      </Link>

      <ul className='lm-quick__plans'>
        <li>
          <a className='lm-quick__plan' href='#plan'>
            <span className='lm-quick__plan-top'>
              <CalendarIcon className='lm-quick__plan-icon' />
              <Tag tone='plan'>PLAN</Tag>
            </span>
            <span className='lm-quick__plan-name'>Daily Ration + Wallet</span>
          </a>
        </li>
        <li>
          <a className='lm-quick__plan' href='#plan'>
            <span className='lm-quick__plan-top'>
              <GiftIcon className='lm-quick__plan-icon' />
              <Tag tone='plan'>PLAN</Tag>
            </span>
            <span className='lm-quick__plan-name'>Occasional Order</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
