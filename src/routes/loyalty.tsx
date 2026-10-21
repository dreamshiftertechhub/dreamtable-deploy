import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { REWARDS } from "@/data/types";
import { formatDate, formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMimi, type MembershipPlan } from "@/store/use-mimi";
import { useUi } from "@/store/use-ui";

export const Route = createFileRoute("/loyalty")({ component: LoyaltyPage });

const PLANS: { id: MembershipPlan; name: string; price: number; copy: string }[] = [
  {
    id: "table",
    name: "Table",
    price: 4500,
    copy: "Double points. Birthday dessert. Skip the Friday queue.",
  },
  {
    id: "host",
    name: "Host",
    price: 15000,
    copy: "Everything in Table, plus 10% off catering and a held booth.",
  },
];

const GIFTS = [5000, 10000, 25000];

function LoyaltyPage() {
  const points = useMimi((s) => s.points);
  const history = useMimi((s) => s.loyaltyHistory);
  const redeem = useMimi((s) => s.redeemReward);
  const membership = useMimi((s) => s.membership);
  const subscribe = useMimi((s) => s.subscribe);
  const buyGift = useMimi((s) => s.buyGiftCard);
  const setCart = useUi((s) => s.setCartOpen);
  const toNext = Math.max(0, 1500 - points);

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-24 md:pt-32">
        <p className="text-[11px] tracking-label text-navy">Loyalty</p>
        <h1 className="mt-3 font-script text-7xl leading-none text-brand md:text-8xl">Dream</h1>
        <p className="mt-1 text-[11px] font-semibold tracking-[0.42em] text-brand">TABLE</p>
        <p className="mt-6 font-display text-4xl">The Circle</p>
        <p className="mt-8 font-display text-7xl tabular-nums">{points.toLocaleString()}</p>
        <p className="mt-2 text-muted">
          {membership !== "none"
            ? `You're on ${membership === "host" ? "Host" : "Table"}.`
            : toNext === 0
              ? "A free side is already yours."
              : `You are ${toNext.toLocaleString()} points away from a free side.`}
        </p>

        <h2 className="mt-16 font-display text-3xl">Subscribe</h2>
        <p className="mt-2 max-w-lg text-sm text-muted">
          A monthly seat at the house. Cancel any time from your account.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                subscribe(p.id);
                toast(`Welcome to ${p.name}.`);
              }}
              className={cn(
                "border p-6 text-left",
                membership === p.id ? "border-ink bg-paper" : "border-line hover:border-ink",
              )}
            >
              <p className="font-display text-3xl">{p.name}</p>
              <p className="mt-2 text-sm font-semibold tabular-nums">{formatNaira(p.price)} / month</p>
              <p className="mt-3 text-sm text-muted">{p.copy}</p>
              <p className="mt-6 text-[11px] tracking-label">
                {membership === p.id ? "Your plan" : "Join"}
              </p>
            </button>
          ))}
        </div>

        <h2 className="mt-16 font-display text-3xl">Gift cards</h2>
        <p className="mt-2 text-sm text-muted">Credit lands on the next order.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {GIFTS.map((n) => (
            <Button
              key={n}
              variant="outline"
              onClick={() => {
                buyGift(n);
                toast(`${formatNaira(n)} gift card added as credit.`);
              }}
            >
              {formatNaira(n)}
            </Button>
          ))}
        </div>

        <h2 className="mt-16 font-display text-3xl">Rewards</h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {REWARDS.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 py-5">
              <div>
                <p className="font-medium">{r.label}</p>
                <p className="text-sm text-muted">{r.points.toLocaleString()} points</p>
              </div>
              <Button
                variant="outline"
                disabled={points < r.points}
                onClick={() => {
                  const err = redeem(r.id);
                  if (err) toast(err);
                  else {
                    toast(`${r.label} added.`);
                    if (r.id !== "discount") setCart(true);
                  }
                }}
              >
                Redeem
              </Button>
            </li>
          ))}
        </ul>

        <h2 className="mt-16 font-display text-3xl">History</h2>
        <ul className="mt-6 space-y-3 text-sm">
          {history.map((h) => (
            <li key={h.id} className="flex justify-between border-b border-line py-3">
              <span>
                {h.label}
                <span className="ml-2 text-muted">{formatDate(h.at)}</span>
              </span>
              <span className="tabular-nums">
                {h.points > 0 ? "+" : ""}
                {h.points}
              </span>
            </li>
          ))}
        </ul>
        <Button asChild variant="ghost" className="mt-8">
          <Link to="/account">Back to account</Link>
        </Button>
      </div>
    </SiteShell>
  );
}
