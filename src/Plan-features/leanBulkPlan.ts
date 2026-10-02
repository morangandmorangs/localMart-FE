/**
 * Mock generator for the 1-month Lean Bulk meal plan.
 *
 * Source: the "Lean Bulk Framework" template (~2700-2800 kcal/day, 5 meals).
 * Each meal lists what it needs per day; the generator multiplies by
 * PLAN_DAYS and rounds up to whole shop packs, so the cart suggestion is
 * exactly what a month of the template consumes.
 */

export const PLAN_DAYS = 30;

export interface PlanMeal {
  name: string;
  items: string;
  kcal: number;
}

export const DAILY_MEALS: PlanMeal[] = [
  { name: "Breakfast", items: "4 whole eggs + 2 whites omelette, rolled oats, banana, almonds", kcal: 700 },
  { name: "Lunch", items: "190 g grilled chicken breast, 200 g cooked rice, dal, salad", kcal: 750 },
  { name: "Pre-workout", items: "2 slices whole-grain bread, peanut butter, apple", kcal: 380 },
  { name: "Post-workout", items: "Whey, banana, cream of rice", kcal: 400 },
  { name: "Dinner", items: "190 g baked fish, roasted sweet potato, broccoli", kcal: 520 },
];

interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  /** Shop pack, e.g. "1 kg". */
  pack: string;
  /** ₹ per pack. */
  price: number;
  /** Which meal it feeds. */
  meal: string;
  /** Amount used per day, in the same unit as `packSize`. */
  perDay: number;
  /** Amount in one pack, in the same unit as `perDay`. */
  packSize: number;
}

const INGREDIENTS: Ingredient[] = [
  { id: "eggs", name: "Farm eggs", emoji: "🥚", pack: "tray of 30", price: 210, meal: "Breakfast", perDay: 6, packSize: 30 },
  { id: "oats", name: "Rolled oats", emoji: "🌾", pack: "1 kg", price: 180, meal: "Breakfast", perDay: 40, packSize: 1000 },
  { id: "almonds", name: "Almonds", emoji: "🌰", pack: "250 g", price: 260, meal: "Breakfast", perDay: 20, packSize: 250 },
  { id: "bananas", name: "Bananas", emoji: "🍌", pack: "dozen", price: 70, meal: "Breakfast / Post-workout", perDay: 2, packSize: 12 },
  { id: "chicken", name: "Chicken breast", emoji: "🍗", pack: "1 kg", price: 320, meal: "Lunch", perDay: 190, packSize: 1000 },
  { id: "rice", name: "Rice", emoji: "🍚", pack: "5 kg", price: 420, meal: "Lunch", perDay: 100, packSize: 5000 },
  { id: "dal", name: "Toor dal", emoji: "🫘", pack: "1 kg", price: 170, meal: "Lunch", perDay: 40, packSize: 1000 },
  { id: "salad", name: "Salad vegetables", emoji: "🥗", pack: "weekly bundle", price: 90, meal: "Lunch", perDay: 1, packSize: 7 },
  { id: "bread", name: "Whole-grain bread", emoji: "🍞", pack: "loaf (16 slices)", price: 60, meal: "Pre-workout", perDay: 2, packSize: 16 },
  { id: "pb", name: "Peanut butter", emoji: "🥜", pack: "1 kg", price: 380, meal: "Pre-workout", perDay: 30, packSize: 1000 },
  { id: "apples", name: "Apples", emoji: "🍎", pack: "1 kg (~5)", price: 170, meal: "Pre-workout", perDay: 1, packSize: 5 },
  { id: "whey", name: "Whey protein", emoji: "🥛", pack: "1 kg (~30 scoops)", price: 2400, meal: "Post-workout", perDay: 1, packSize: 30 },
  { id: "cream-rice", name: "Cream of rice", emoji: "🥣", pack: "500 g", price: 220, meal: "Post-workout", perDay: 40, packSize: 500 },
  { id: "fish", name: "Rohu fish, cleaned", emoji: "🐟", pack: "1 kg", price: 380, meal: "Dinner", perDay: 190, packSize: 1000 },
  { id: "sweet-potato", name: "Sweet potato", emoji: "🍠", pack: "1 kg", price: 60, meal: "Dinner", perDay: 150, packSize: 1000 },
  { id: "broccoli", name: "Broccoli", emoji: "🥦", pack: "500 g", price: 70, meal: "Dinner", perDay: 100, packSize: 500 },
  { id: "olive-oil", name: "Olive oil", emoji: "🫒", pack: "1 L", price: 850, meal: "Cooking", perDay: 30, packSize: 1000 },
  { id: "water", name: "Drinking water", emoji: "💧", pack: "20 L jar", price: 60, meal: "Daily (4 L)", perDay: 4, packSize: 20 },
];

export interface PlanItem {
  id: string;
  name: string;
  emoji: string;
  pack: string;
  price: number;
  meal: string;
  /** Packs the plan recommends for the month. */
  suggested: number;
}

export function generateMonthlyPlan(days = PLAN_DAYS): PlanItem[] {
  return INGREDIENTS.map(({ perDay, packSize, ...rest }) => ({
    ...rest,
    suggested: Math.max(1, Math.ceil((perDay * days) / packSize)),
  }));
}

export const DAILY_KCAL = DAILY_MEALS.reduce((sum, m) => sum + m.kcal, 0);

/** Shelf-stable items arrive in the first delivery; the rest are spread over
 *  the weeks so fresh food is never sitting in the fridge for a month. */
const STAPLES = new Set(["oats", "almonds", "rice", "dal", "pb", "whey", "cream-rice", "olive-oil"]);

export interface WeekDelivery {
  week: number;
  date: Date;
  lines: { item: PlanItem; quantity: number }[];
  total: number;
}

export function scheduleWeekly(items: PlanItem[], from = new Date()): WeekDelivery[] {
  const weeks = Math.ceil(PLAN_DAYS / 7);
  const first = new Date(from);
  first.setHours(9, 0, 0, 0);
  first.setDate(first.getDate() + 1);

  return Array.from({ length: weeks }, (_, w) => {
    const date = new Date(first);
    date.setDate(first.getDate() + w * 7);
    const lines = items
      .map((item) => {
        let quantity: number;
        if (STAPLES.has(item.id)) {
          quantity = w === 0 ? item.suggested : 0;
        } else {
          const base = Math.floor(item.suggested / weeks);
          quantity = base + (w < item.suggested % weeks ? 1 : 0);
        }
        return { item, quantity };
      })
      .filter((l) => l.quantity > 0);
    const total = lines.reduce((s, l) => s + l.item.price * l.quantity, 0);
    return { week: w + 1, date, lines, total };
  });
}
