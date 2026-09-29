import './Home.css';
import { AiDietPlanner } from './components/AiDietPlanner';
import { CategoryGrid } from './components/CategoryGrid';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PlanSection } from './components/PlanSection';
import { SignInStrip } from './components/SignInStrip';

export default function Home() {
  return (
    <div className="lm-home">
      {/* TODO(cart): cartCount comes from the cart service. */}
      <Header cartCount={0} />

      <main className="lm-main">
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
