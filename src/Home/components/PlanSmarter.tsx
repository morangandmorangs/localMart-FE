import { Link } from "react-router-dom";
import { ArrowRightIcon, CalendarIcon, GiftIcon, SparkleIcon } from "./Icons";
import { Tag } from "./Tag";

/** Both plans are set up in <PlanSection />, further down the page. */
const PLANS = [
  { name: "Daily Ration + Wallet", Icon: CalendarIcon },
  { name: "Occasional Order", Icon: GiftIcon },
];

/** Hero card beside the shop tiles: the AI diet planner and the two plans. */
export function PlanSmarter() {
  return (
    <section className='lm-smarter' aria-labelledby='lm-smarter-title'>
      <div className='lm-smarter__head'>
        <h2 className='lm-card-title' id='lm-smarter-title'>
          Plan smarter
        </h2>
        <Tag tone='plan'>AI + PLANNING</Tag>
      </div>

      <Link className='lm-smarter__ai' to='/ai-diet-planner'>
        <span className='lm-smarter__ai-mark'>
          <SparkleIcon />
        </span>
        <span className='lm-smarter__ai-body'>
          <span className='lm-smarter__ai-title'>
            AI Diet Planner <Tag tone='mint'>AI</Tag>
          </span>
          <span className='lm-smarter__ai-text'>
            Upload a diet plan, get a ready-to-order list
          </span>
        </span>
        <ArrowRightIcon className='lm-smarter__ai-arrow' />
      </Link>

      <ul className='lm-smarter__plans'>
        {PLANS.map(({ name, Icon }) => (
          <li key={name}>
            <a className='lm-smarter__plan' href='#plan'>
              <span className='lm-smarter__plan-top'>
                <Icon className='lm-smarter__plan-icon' />
                <Tag tone='plan'>PLAN</Tag>
              </span>
              <span className='lm-smarter__plan-name'>{name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
