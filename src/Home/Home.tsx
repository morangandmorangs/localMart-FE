// Home.css is imported from src/index.css, in the components cascade layer.

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { MobileSearch } from "./components/MobileSearch";
import { NetworkSection } from "./components/NetworkSection";
import { PlanSection } from "./components/PlanSection";

export default function Home() {
  return (
    <div className='lm-home'>
      <Header />

      <main className='lm-main'>
        <MobileSearch />
        <Hero />
        <NetworkSection />
        <PlanSection />
      </main>

      <Footer />
    </div>
  );
}
