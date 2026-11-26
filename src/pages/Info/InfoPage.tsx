import { Link, useLocation } from "react-router-dom";

import { APP_LINKS, GET_APP_PATH } from "../../config/apps";
import { Footer } from "../../Home/components/Footer";
import { Header } from "../../Home/components/Header";
import "./Info.css";

interface InfoContent {
  title: string;
  intro: string;
  points: string[];
  /** Where the reader goes next, when there is somewhere to go. */
  cta?: { label: string; href: string };
}

// Placeholder copy — swap in the real text (especially Terms) before launch.
const CONTENT: Record<string, InfoContent> = {
  "/about": {
    title: "About Local Mart",
    intro:
      "Local Mart brings groceries, fresh produce, hot meals and medicine from Numaligarh's own shops and kitchens to your door.",
    points: [
      "Fresh produce and meat from local farms and ghats.",
      "Cooked food from neighbourhood kitchens.",
      "Delivery by drivers from the community.",
    ],
  },
  "/sell": {
    title: "Sell on Local Mart",
    intro:
      "Run a shop or a kitchen nearby? Reach customers in your area with the Local Mart Merchant app.",
    points: [
      "Install the Merchant app and create your shop account.",
      "List your products and receive order alerts as they come in.",
      "Drivers pick up and deliver for you.",
    ],
    cta: { label: "Get the Merchant app on Google Play", href: APP_LINKS.merchant },
  },
  "/help": {
    title: "Help",
    intro: "Quick answers to the most common questions.",
    points: [
      "Orders are placed and tracked in the Local Mart app.",
      "This website shows what is in the market today.",
      "Prescription medicine is checked by a pharmacist before it is dispensed.",
    ],
    cta: { label: "Get the Local Mart app", href: GET_APP_PATH },
  },
  "/terms": {
    title: "Terms",
    intro: "The terms of using Local Mart are being finalised.",
    points: ["Please check back soon for the full terms."],
  },
  "/support": {
    title: "Support",
    intro: "Stuck on something? Tell us and we reply within one working day.",
    points: [
      "For an order, open it in the Local Mart app and use its help.",
      "Include your order details when you get in touch.",
    ],
  },
};

export default function InfoPage() {
  const { pathname } = useLocation();
  const page = CONTENT[pathname.replace(/\/+$/, "") || "/"];

  return (
    <div className='lm-home'>
      <Header />
      <main className='lm-main'>
        <article className='lm-info'>
          <h1>{page?.title ?? "Local Mart"}</h1>
          <p className='lm-info__intro'>{page?.intro}</p>
          <ul>
            {page?.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          {page?.cta && (
            <p className='lm-info__cta'>
              {page.cta.href.startsWith("http") ? (
                <a href={page.cta.href} target='_blank' rel='noopener noreferrer'>
                  {page.cta.label}
                </a>
              ) : (
                <Link to={page.cta.href}>{page.cta.label}</Link>
              )}
            </p>
          )}
          <Link to='/'>Back to the homepage</Link>
        </article>
      </main>
      <Footer />
    </div>
  );
}
