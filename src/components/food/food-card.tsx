import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/format";
import type { MenuItem } from "@/data/types";
import { useMimi } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";
import { SpiceDots } from "./spice";

export function FoodCard({
  item,
  index,
  layout = "grid",
}: {
  item: MenuItem;
  index?: number;
  layout?: "grid" | "editorial" | "rail";
}) {
  const fav = useMimi((s) => s.favouriteIds.includes(item.id));
  const toggle = useMimi((s) => s.toggleFavourite);
  const open = useUi((s) => s.openFood);
  const add = useMimi((s) => s.addToCart);
  const setCart = useUi((s) => s.setCartOpen);

  const sold = !item.available;

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-transparent text-left",
        layout === "rail" && "w-[78vw] shrink-0 snap-start sm:w-80",
      )}
    >
      <button
        type="button"
        onClick={() => open(item.id)}
        className="relative block overflow-hidden bg-surface"
        aria-label={`View ${item.name}`}
      >
        <img
          src={item.image}
          alt={item.name}
          className={cn(
            "aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
            sold && "opacity-60",
          )}
        />
        {item.signature ? (
          <span className="absolute left-3 top-3 font-display text-2xl text-white drop-shadow">
            {String(item.signature).padStart(2, "0")}
          </span>
        ) : index != null ? (
          <span className="absolute left-3 top-3 text-[11px] font-semibold tracking-label text-white/80">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        {sold && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-2 text-center text-[11px] tracking-label text-white">
            Sold out tonight
          </span>
        )}
      </button>

      <div className="flex items-start justify-between gap-3 pt-4">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight text-ink">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm font-semibold tabular-nums">{formatNaira(item.price)}</span>
            <SpiceDots level={item.spice} />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1">
          <button
            type="button"
            aria-label={fav ? "Remove from favourites" : "Save to favourites"}
            aria-pressed={fav}
            onClick={() => toggle(item.id)}
            className="grid size-11 place-items-center text-ink hover:text-brand"
          >
            <Heart className={cn("size-4", fav && "fill-brand text-brand")} />
          </button>
          <button
            type="button"
            disabled={sold}
            aria-label={item.customizable ? `Customise ${item.name}` : `Add ${item.name} to cart`}
            onClick={() => {
              if (item.customizable) {
                open(item.id);
                return;
              }
              add({
                menuItemId: item.id,
                name: item.name,
                image: item.image,
                unitPrice: item.price,
                quantity: 1,
                extras: [],
              });
              toast("Added to your order.");
              setCart(true);
            }}
            className="grid size-11 place-items-center bg-brand text-white transition-opacity hover:bg-brand-dark disabled:opacity-30"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
