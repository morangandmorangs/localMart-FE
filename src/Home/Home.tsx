// Home.css is imported from src/index.css, in the components cascade layer.

import { AiDietPlanner } from "./components/AiDietPlanner";
import { CategoryGrid } from "./components/CategoryGrid";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { MobileSearch } from "./components/MobileSearch";
import { PlanSection } from "./components/PlanSection";
import { SignInStrip } from "./components/SignInStrip";

export default function Home() {
  return (
    <div className='lm-home'>
      <Header />

      <main className='lm-main'>
        <MobileSearch />
        <Hero />
        <CategoryGrid />
        <AiDietPlanner />
        <PlanSection />
        <SignInStrip />
      </main>

      <Footer />
    </div>
  );
}
