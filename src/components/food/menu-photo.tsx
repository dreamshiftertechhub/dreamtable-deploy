import type { MenuItem } from "@/data/types";

/** Only show photography when the local asset actually depicts this menu item.
 * Remaining dishes get a labelled placeholder until approved matching photos
 * are uploaded. Never present another dish as the ordered meal.
 */
const VERIFIED_PHOTO_IDS = new Set([
  "signature-jollof", "suya-fries", "creamy-pasta", "fire-chicken",
  "beef-burger", "seafood-rice", "chocolate", "ofada",
]);

export function MenuPhoto({ item, className = "" }: { item: MenuItem; className?: string }) {
  if (VERIFIED_PHOTO_IDS.has(item.id)) {
    return <img src={item.image} alt={item.name} loading="lazy" className={className} />;
  }
  return <div role="img" aria-label={`Photograph pending for ${item.name}`} className={`flex flex-col items-center justify-center bg-[#292b24] px-5 text-center text-cream ${className}`}>
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/60">RealMeal menu</span>
    <span className="mt-3 max-w-xs font-display text-2xl leading-tight">{item.name}</span>
    <span className="mt-3 text-[11px] text-cream/65">Dish photograph coming soon</span>
  </div>;
}
