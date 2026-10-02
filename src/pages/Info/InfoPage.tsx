import { Link, useLocation } from "react-router-dom";

import { Footer } from "../../Home/components/Footer";
import { Header } from "../../Home/components/Header";
import "./Info.css";

interface InfoContent {
  title: string;
  intro: string;
  points: string[];
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
      "Run a shop or a kitchen nearby? Reach customers in your area with a merchant account.",
    points: [
      "Create a merchant account and list your products.",
      "Receive order alerts as they come in.",
      "Drivers pick up and deliver for you.",
    ],
  },
  "/help": {
    title: "Help",
    intro: "Quick answers to the most common questions.",
    points: [
      "Orders: sign in and open your account to see your orders.",
      "Cart: items stay in your cart until you check out.",
      "Prescription medicine can't be added straight to the cart.",
    ],
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
      "Try the support chat at the bottom right of the home page first.",
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
          <Link to='/'>Back to the homepage</Link>
        </article>
      </main>
      <Footer />
    </div>
  );
}
