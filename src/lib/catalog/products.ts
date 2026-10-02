import type { Restaurant } from "./types";

/**
 * Mock catalogue for the Food aisle.
 *
 * Fresh, Grocery and Medicine now read from the live products API
 * (redux-store/Services/ProductApi.ts) — Food still lists restaurants from
 * here, since there's no restaurant endpoint yet.
 */

/** Food — ordered from a kitchen, so the page lists restaurants, not items. */
export const RESTAURANTS: Restaurant[] = [
  {
    id: "rest-jonaki",
    name: "Jonaki Bhojonaloy",
    image: "https://images.pexels.com/photos/36885716/pexels-photo-36885716.jpeg?auto=compress&cs=tinysrgb&w=800",
    cuisine: "Assamese thali · Home-style",
    rating: 4.6,
    ratingCount: 412,
    prepMinutes: 30,
    priceForTwo: 320,
    isOpen: true,
    signatureDishes: ["Masor tenga", "Khar", "Aloo pitika"],
  },
  {
    id: "rest-pitha-ghor",
    name: "Pitha Ghor",
    image: "https://images.pexels.com/photos/7378470/pexels-photo-7378470.jpeg?auto=compress&cs=tinysrgb&w=800",
    cuisine: "Pitha · Sweets",
    rating: 4.8,
    ratingCount: 286,
    prepMinutes: 25,
    priceForTwo: 180,
    isOpen: true,
    signatureDishes: ["Til pitha", "Narikol laru", "Ghila pitha"],
  },
  {
    id: "rest-refinery-tiffin",
    name: "Refinery Tiffin Room",
    image: "https://images.pexels.com/photos/38834853/pexels-photo-38834853.jpeg?auto=compress&cs=tinysrgb&w=800",
    cuisine: "Tiffin · North Indian",
    rating: 4.3,
    ratingCount: 158,
    prepMinutes: 20,
    priceForTwo: 220,
    isOpen: true,
    signatureDishes: ["Puri sabji", "Paratha thali", "Masala chai"],
  },
  {
    id: "rest-hill-side",
    name: "Hill Side Dhaba",
    image: "https://images.pexels.com/photos/18803174/pexels-photo-18803174.jpeg?auto=compress&cs=tinysrgb&w=800",
    cuisine: "Street food · Snacks",
    rating: 4.1,
    ratingCount: 97,
    prepMinutes: 35,
    priceForTwo: 260,
    isOpen: false,
    signatureDishes: ["Chowmein", "Momo", "Egg roll"],
  },
  {
    id: "rest-green-bowl",
    name: "Green Bowl Kitchen",
    image: "https://images.pexels.com/photos/32810338/pexels-photo-32810338.jpeg?auto=compress&cs=tinysrgb&w=800",
    cuisine: "Healthy bowls · Salads",
    rating: 4.5,
    ratingCount: 64,
    prepMinutes: 25,
    priceForTwo: 380,
    isOpen: true,
    signatureDishes: ["Quinoa bowl", "Grilled paneer bowl", "Fruit bowl"],
  },
];

/** Below this, the card says how few are left instead of just "in stock". */
export const LOW_STOCK_THRESHOLD = 10;
