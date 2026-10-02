import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/": "Local Mart - Home",
  "/category/livestock-vegetables": "Livestock & Vegetables",
  "/category/grocery": "Grocery",
  "/category/food": "Food",
  "/category/medicine": "Medicine",
  "/about": "About - Local Mart",
  "/sell": "Sell on Local Mart",
  "/help": "Help - Local Mart",
  "/terms": "Terms - Local Mart",
  "/support": "Support - Local Mart",
};

const FALLBACK_TITLE = "Local Mart";

export const usePageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Exact match first
    const exact = PAGE_TITLES[pathname];
    if (exact) {
      document.title = exact;
      return;
    }

    // Prefix match for dynamic segments (e.g. /bikes/edit/:id)
    const prefix = Object.keys(PAGE_TITLES)
      .filter((key) => pathname.startsWith(key) && key !== "/")
      .sort((a, b) => b.length - a.length)[0]; // longest match wins

    document.title = prefix ? PAGE_TITLES[prefix] : FALLBACK_TITLE;
  }, [pathname]);
};
