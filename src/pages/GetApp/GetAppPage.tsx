import { APP_LINKS } from "../../config/apps";
import { Footer } from "../../Home/components/Footer";
import { Header } from "../../Home/components/Header";
import { ArrowRightIcon, CartIcon } from "../../Home/components/Icons";

const IN_THE_APP = [
  "Order groceries, fresh produce, meals and medicine",
  "Track every delivery to your door",
  "Daily Ration, occasion kits and the Local Mart wallet",
  "Upload prescriptions for a pharmacist to check",
];

const PARTNER_APPS = [
  { label: "Local Mart Merchant", note: "for shops and kitchens", href: APP_LINKS.merchant },
  { label: "Local Mart Driver", note: "for delivery partners", href: APP_LINKS.driver },
  { label: "Farmer web app", note: "for farmers", href: APP_LINKS.farmer },
];

/** Where every ordering action on the site leads: the site is a showcase,
 *  and orders are placed in the Local Mart app. */
export default function GetAppPage() {
  return (
    <div className='lm-home'>
      <Header />
      <main className='lm-main'>
        <section className='lm-getapp' aria-labelledby='lm-getapp-title'>
          <span className='lm-getapp__mark'>
            <CartIcon />
          </span>
          <h1 className='lm-getapp__title' id='lm-getapp-title'>
            Order in the Local Mart app
          </h1>
          <p className='lm-getapp__intro'>
            This site lets you look around the market. To place an order,
            install the Local Mart app.
          </p>

          <ul className='lm-getapp__list'>
            {IN_THE_APP.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <a
            className='lm-btn lm-btn--primary lm-btn--pill lm-getapp__cta'
            href={APP_LINKS.customer}
            target='_blank'
            rel='noopener noreferrer'
          >
            Get it on Google Play
            <ArrowRightIcon className='lm-btn__icon' />
          </a>

          <div className='lm-getapp__partners'>
            <h2 className='lm-getapp__partners-title'>Selling, delivering or farming?</h2>
            <ul>
              {PARTNER_APPS.map(({ label, note, href }) => (
                <li key={label}>
                  <a href={href} target='_blank' rel='noopener noreferrer'>
                    {label}
                  </a>{" "}
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
