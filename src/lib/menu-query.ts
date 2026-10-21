import type { MenuItem } from "@/data/types";
import type { FilterState } from "@/components/food/menu-filters";

export function filterMenu(items: MenuItem[], f: FilterState) {
  let list = items.filter((item) => {
    if (f.category !== "all" && item.category !== f.category) return false;
    if (f.popular && !item.popular) return false;
    if (f.spicy && item.spice < 2) return false;
    if (f.vegetarian && !item.vegetarian) return false;
    if (f.query.trim()) {
      const q = f.query.toLowerCase();
      const hay = `${item.name} ${item.description} ${item.ingredients.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  list = [...list].sort((a, b) => {
    if (f.sort === "price-asc") return a.price - b.price;
    if (f.sort === "price-desc") return b.price - a.price;
    if (f.sort === "name") return a.name.localeCompare(b.name);
    const pop = Number(b.popular) - Number(a.popular);
    if (pop) return pop;
    return (a.signature ?? 99) - (b.signature ?? 99);
  });
  return list;
}
