import { useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  applyPromo,
  cartSubtotal,
  deliveryFeeFor,
  lineTotal,
  useActivePromo,
  useMimi,
} from "@/store/use-mimi";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { saveHouseOrder } from "@/lib/house.functions";
import { RESTAURANT_ADDRESS, type Fulfillment, type PaymentMethod } from "@/data/types";
import { TransferDetails } from "@/components/order/transfer-details";

const PRELAUNCH = true;

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const cart = useMimi((s) => s.cart);
  const profile = useMimi((s) => s.profile);
  const addresses = useMimi((s) => s.addresses);
  const credit = useMimi((s) => s.discountCredit);
  const promo = useActivePromo();
  const place = useMimi((s) => s.placeOrder);
  const navigate = useNavigate();
  const { user } = useCurrentUserState();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(addresses[0]?.line ?? "");
  const [apartment, setApartment] = useState(addresses[0]?.apartment ?? "");
  const [instructions, setInstructions] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [payment, setPayment] = useState<PaymentMethod>("transfer");

  const subtotal = cartSubtotal(cart);
  const discount = applyPromo(subtotal, promo) + credit;
  const delivery = deliveryFeeFor(subtotal, fulfillment);
  const total = Math.max(0, subtotal + delivery - discount);

  if (PRELAUNCH) {
    return <SiteShell><div className="mx-auto max-w-2xl px-4 py-32 text-center"><p className="text-[11px] font-semibold tracking-label text-brand">RealMeal ordering</p><h1 className="mt-4 font-display text-4xl md:text-5xl">Online ordering is being configured.</h1><p className="mt-5 text-muted">Our Iyana Ipaja restaurant is open for dine-in. Online checkout, payment and delivery are not yet available through this website. Please do not transfer money for an online order.</p><Button asChild className="mt-8"><Link to="/menu">Explore the menu</Link></Button></div></SiteShell>;
  }

  if (cart.length === 0) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-xl px-4 py-32 text-center">
          <h1 className="font-display text-4xl">Your table is waiting.</h1>
          <p className="mt-3 text-muted">Add something delicious first.</p>
          <Button asChild className="mt-8">
            <Link to="/menu">Explore menu</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  function next() {
    if (step < 4) setStep(step + 1);
    else {
      const order = place({
        fulfillment,
        payment,
        customer: {
          name,
          phone,
          address: fulfillment === "pickup" ? RESTAURANT_ADDRESS : address,
          apartment: fulfillment === "pickup" ? "" : apartment,
          instructions,
        },
      });
      if (user && !user.isDevFallback) {
        void saveHouseOrder({ data: { order } }).catch(() => {});
      }
      void navigate({ to: "/confirmation/$orderId", params: { orderId: order.id } });
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-24 md:grid-cols-12 md:px-8 md:pt-32">
        <div className="md:col-span-7">
          <p className="text-[11px] tracking-label text-brand">Checkout</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Almost there.</h1>
          <ol className="mt-8 flex gap-4 text-[11px] tracking-label">
            {["Delivery", "Method", "Payment", "Review"].map((l, i) => (
              <li key={l} className={cn(step === i + 1 ? "text-brand" : "text-subtle")}>
                0{i + 1} {l}
              </li>
            ))}
          </ol>

          {step === 1 && (
            <div className="mt-10 space-y-4">
              <Field label="Full name" htmlFor="name">
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </Field>
              <Field label="Phone number" htmlFor="phone">
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="mt-10 space-y-3">
              <Choice
                on={fulfillment === "delivery"}
                title="Delivery"
                copy="About 28 minutes from the Victoria Island kitchen."
                onClick={() => setFulfillment("delivery")}
              />
              <Choice
                on={fulfillment === "pickup"}
                title="Pickup"
                copy="Ready in about 18 minutes at 14 Adeola Odeku Street."
                onClick={() => setFulfillment("pickup")}
              />
              {fulfillment === "delivery" && (
                <div className="space-y-4 pt-4">
                  <Field label="Delivery address" htmlFor="address">
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </Field>
                  <Field label="Apartment / house number" htmlFor="apt">
                    <Input id="apt" value={apartment} onChange={(e) => setApartment(e.target.value)} />
                  </Field>
                  <Field label="Delivery instructions" htmlFor="inst">
                    <Textarea
                      id="inst"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Gate code, landmark, who to call"
                    />
                  </Field>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="mt-10 space-y-3">
              <Choice
                on={payment === "transfer"}
                title="Bank transfer"
                copy="Moniepoint · Dreamtable · 9015828778"
                onClick={() => setPayment("transfer")}
              />
              {payment === "transfer" && <TransferDetails total={total} />}
              <Choice
                on={payment === "card"}
                title="Card on arrival"
                copy="Pay the rider or the counter when the food is in your hands. We do not take card numbers here."
                onClick={() => setPayment("card")}
              />
              <Choice
                on={payment === "cash"}
                title="Cash on delivery"
                copy="Have the exact amount ready."
                onClick={() => setPayment("cash")}
              />
            </div>
          )}

          {step === 4 && (
            <div className="mt-10 space-y-4 text-sm">
              <p>
                {name} · {phone}
              </p>
              <p className="text-muted">
                {fulfillment === "delivery"
                  ? `${address}${apartment ? `, ${apartment}` : ""}`
                  : "Pickup at DreamTable, Victoria Island"}
              </p>
              <p className="text-muted">
                Paying by{" "}
                {payment === "card" ? "card on arrival" : payment === "transfer" ? "Moniepoint transfer" : "cash"}.
              </p>
              {payment === "transfer" && <TransferDetails total={total} />}
            </div>
          )}

          <div className="mt-10 flex gap-3">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button
              type="button"
              onClick={next}
              disabled={
                (step === 1 && (!name.trim() || !phone.trim())) ||
                (step === 2 && fulfillment === "delivery" && !address.trim())
              }
            >
              {step === 4 ? "Place order" : "Continue"}
            </Button>
          </div>
        </div>

        <aside className="md:col-span-5">
          <div className="border border-line bg-paper p-6">
            <p className="text-[11px] tracking-label text-muted">Your bag</p>
            <ul className="mt-4 space-y-3">
              {cart.map((l) => (
                <li key={l.lineId} className="flex justify-between gap-3 text-sm">
                  <span>
                    {l.quantity}× {l.name}
                  </span>
                  <span className="tabular-nums">{formatNaira(lineTotal(l))}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-1.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular-nums">{formatNaira(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{fulfillment === "pickup" ? "Pickup" : "Delivery"}</dt>
                <dd className="tabular-nums">{delivery === 0 ? "—" : formatNaira(delivery)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-ok">
                  <dt>Discount</dt>
                  <dd className="tabular-nums">−{formatNaira(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatNaira(total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function Choice({
  on,
  title,
  copy,
  onClick,
}: {
  on: boolean;
  title: string;
  copy: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("w-full border p-5 text-left", on ? "border-ink bg-paper" : "border-line")}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted">{copy}</p>
    </button>
  );
}
