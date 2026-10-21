import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  EXTRAS,
  PROTEINS,
  SPICE_CHOICES,
  type ExtraId,
  type Protein,
  type SpiceChoice,
} from "@/data/types";
import { extraCost, useMimi } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";
import { Qty } from "./qty";
import { SpiceDots } from "./spice";

export function FoodModal() {
  const foodId = useUi((s) => s.foodId);
  const close = useUi((s) => s.closeFood);
  const item = useMimi((s) => s.items.find((i) => i.id === foodId));

  return (
    <Dialog open={!!foodId} onOpenChange={(o) => !o && close()}>
      {item ? <FoodBody key={item.id} /> : null}
    </Dialog>
  );
}

function FoodBody() {
  const foodId = useUi((s) => s.foodId);
  const close = useUi((s) => s.closeFood);
  const item = useMimi((s) => s.items.find((i) => i.id === foodId));
  const add = useMimi((s) => s.addToCart);
  const setCart = useUi((s) => s.setCartOpen);
  const fav = useMimi((s) => (item ? s.favouriteIds.includes(item.id) : false));
  const toggle = useMimi((s) => s.toggleFavourite);

  const [qty, setQty] = useState(1);
  const [protein, setProtein] = useState<Protein>("chicken");
  const [extras, setExtras] = useState<ExtraId[]>([]);
  const [spice, setSpice] = useState<SpiceChoice>("medium");
  const [notes, setNotes] = useState("");

  if (!item) return null;

  const proteinPrice = item.customizable
    ? (PROTEINS.find((p) => p.id === protein)?.price ?? 0)
    : 0;
  const extrasPrice = item.customizable ? extraCost(extras) : 0;
  const unit = item.price + proteinPrice + extrasPrice;
  const total = unit * qty;

  function toggleExtra(id: ExtraId) {
    setExtras((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  return (
    <DialogContent className="flex h-[min(92vh,760px)] w-[min(96vw,780px)] flex-col overflow-hidden p-0 md:grid md:h-[min(86vh,720px)] md:grid-cols-2 md:grid-rows-1">
      <div className="relative h-44 shrink-0 bg-surface md:h-full md:min-h-[28rem]">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex min-h-0 flex-col bg-cream">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 md:p-8">
          <p className="text-[11px] tracking-label text-muted">{item.category}</p>
          <DialogTitle className="mt-1">{item.name}</DialogTitle>
          <DialogDescription className="mt-2">{item.description}</DialogDescription>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-lg font-semibold tabular-nums">{formatNaira(item.price)}</span>
            <SpiceDots level={item.spice} />
          </div>

          <div className="mt-4 text-sm text-muted">
            <span className="text-[11px] font-semibold tracking-label text-ink">Ingredients. </span>
            {item.ingredients.join(" · ")}
          </div>

          {item.customizable && (
            <div className="mt-6 space-y-6 pb-2">
              <fieldset>
                <Label className="mb-2 block">Protein</Label>
                <div className="flex flex-wrap gap-2">
                  {PROTEINS.map((p) => (
                    <Chip
                      key={p.id}
                      active={protein === p.id}
                      onClick={() => setProtein(p.id)}
                      label={p.price ? `${p.label} +${formatNaira(p.price)}` : p.label}
                    />
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <Label className="mb-2 block">Extras</Label>
                <div className="flex flex-wrap gap-2">
                  {EXTRAS.map((e) => (
                    <Chip
                      key={e.id}
                      active={extras.includes(e.id)}
                      onClick={() => toggleExtra(e.id)}
                      label={`${e.label} +${formatNaira(e.price)}`}
                    />
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <Label className="mb-2 block">Spice level</Label>
                <div className="flex flex-wrap gap-2">
                  {SPICE_CHOICES.map((s) => (
                    <Chip
                      key={s.id}
                      active={spice === s.id}
                      onClick={() => setSpice(s.id)}
                      label={s.label}
                    />
                  ))}
                </div>
              </fieldset>
              <div>
                <Label htmlFor="notes" className="mb-2 block">
                  Special instructions
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="No onions. Extra napkins. You know."
                />
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-line bg-cream p-4 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <Qty value={qty} onChange={setQty} />
            <button
              type="button"
              aria-label="Favourite"
              onClick={() => toggle(item.id)}
              className="grid size-11 place-items-center border border-line"
            >
              <Heart className={cn("size-4", fav && "fill-brand text-brand")} />
            </button>
          </div>
          <Button
            size="lg"
            className="mt-3 w-full"
            disabled={!item.available}
            onClick={() => {
              add({
                menuItemId: item.id,
                name: item.name,
                image: item.image,
                unitPrice: unit,
                quantity: qty,
                protein: item.customizable ? protein : undefined,
                extras: item.customizable ? extras : [],
                spice: item.customizable ? spice : undefined,
                notes: notes || undefined,
              });
              toast("Added to your order.");
              close();
              setCart(true);
            }}
          >
            Add to cart · {formatNaira(total)}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-10 px-3 text-[11px] font-semibold tracking-label border transition-colors",
        active ? "border-ink bg-ink text-cream" : "border-line bg-paper text-ink hover:border-ink",
      )}
    >
      {label}
    </button>
  );
}
