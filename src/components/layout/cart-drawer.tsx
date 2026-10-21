import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Qty } from "@/components/food/qty";
import { EXTRAS, PROMOS } from "@/data/types";
import { formatNaira } from "@/lib/format";
import {
  applyPromo,
  cartSubtotal,
  deliveryFeeFor,
  lineTotal,
  useActivePromo,
  useMimi,
} from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";
import { useState } from "react";

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);
  const cart = useMimi((s) => s.cart);
  const setQty = useMimi((s) => s.setQty);
  const remove = useMimi((s) => s.removeLine);
  const applyCode = useMimi((s) => s.applyCode);
  const promoError = useMimi((s) => s.promoError);
  const promoCode = useMimi((s) => s.promoCode);
  const credit = useMimi((s) => s.discountCredit);
  const promo = useActivePromo();
  const [code, setCode] = useState("");

  const subtotal = cartSubtotal(cart);
  const discount = applyPromo(subtotal, promo) + credit;
  const delivery = deliveryFeeFor(subtotal, "delivery");
  const total = Math.max(0, subtotal + delivery - discount);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your order</SheetTitle>
          <SheetDescription>
            {cart.length === 0 ? "Your table is waiting." : `${cart.length} line${cart.length === 1 ? "" : "s"}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-4">
            {cart.length === 0 ? (
              <div className="py-10">
                <p className="font-display text-3xl">Your table is waiting.</p>
                <Button asChild className="mt-6" onClick={() => setOpen(false)}>
                  <Link to="/menu">Explore menu</Link>
                </Button>
              </div>
            ) : (
              cart.map((line) => (
                <div key={line.lineId} className="flex gap-3">
                  <img src={line.image} alt="" className="size-20 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-tight">{line.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {[
                        line.customLabel,
                        line.protein,
                        line.spice,
                        ...line.extras.map((e) => EXTRAS.find((x) => x.id === e)?.label ?? e),
                        line.notes,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <Qty value={line.quantity} onChange={(n) => setQty(line.lineId, n)} />
                      <span className="text-sm tabular-nums">{formatNaira(lineTotal(line))}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${line.name}`}
                    onClick={() => remove(line.lineId)}
                    className="grid size-10 place-items-center text-muted hover:text-brand"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-line px-6 py-5">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const ok = applyCode(code);
                  if (ok) toast(`Promo ${code.toUpperCase()} applied.`);
                }}
              >
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Promo code · try DREAM10"
                  aria-label="Promo code"
                />
                <Button type="submit" variant="outline">
                  Apply
                </Button>
              </form>
              {promoError && <p className="mt-2 text-xs text-brand">{promoError}</p>}
              {promoCode && (
                <p className="mt-2 text-xs text-ok">
                  {PROMOS.find((p) => p.code === promoCode)?.label}
                </p>
              )}
              <dl className="mt-4 space-y-1.5 text-sm">
                <Row label="Subtotal" value={formatNaira(subtotal)} />
                <Row label="Delivery" value={delivery === 0 ? "On the house" : formatNaira(delivery)} />
                {discount > 0 && <Row label="Discount" value={`−${formatNaira(discount)}`} />}
                <Row label="Total" value={formatNaira(total)} strong />
              </dl>
              <Button asChild size="lg" className="mt-4 w-full" onClick={() => setOpen(false)}>
                <Link to="/checkout">Checkout</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "font-semibold tabular-nums" : "tabular-nums"}>{value}</dd>
    </div>
  );
}
