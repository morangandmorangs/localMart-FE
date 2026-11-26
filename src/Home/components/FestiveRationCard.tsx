import { Link } from "react-router-dom";
import { GET_APP_PATH } from "../../config/apps";
import { FESTIVE_KITS } from "../../lib/catalog/festiveKits";
import { GiftIcon } from "./Icons";

export function FestiveRationCard() {
  return (
    <article className='lm-plan-card' aria-labelledby='lm-festive-title'>
      <div className='lm-plan-card__head'>
        <span className='lm-plan-card__mark'>
          <GiftIcon />
        </span>
        <div>
          <h3 className='lm-plan-card__title' id='lm-festive-title'>
            Occasion Ration Kits
          </h3>
          <p className='lm-plan-card__subtitle'>
            Pre-book occasion kits before the rush
          </p>
        </div>
      </div>

      <ul className='lm-kits'>
        {FESTIVE_KITS.map((kit) => (
          <li className='lm-kits__item' key={kit.slug}>
            <p className='lm-kits__period'>{kit.period}</p>
            <p className='lm-kits__name'>{kit.name}</p>
            <p className='lm-kits__contents'>{kit.contents}</p>
          </li>
        ))}
      </ul>

      <div className='lm-plan-card__actions'>
        <Link className='lm-btn lm-btn--primary' to={GET_APP_PATH}>
          Pre-book a kit in the app
        </Link>
      </div>
    </article>
  );
}
