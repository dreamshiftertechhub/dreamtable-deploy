import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { TrackingTimeline } from "@/components/order/timeline";
import { formatNaira } from "@/lib/format";
import { lineTotal, useMimi } from "@/store/use-mimi";

export const Route = createFileRoute("/confirmation/$orderId")({ component: ConfirmationPage });

function ConfirmationPage() {
  const { orderId } = Route.useParams();
  const hydrated = useMimi((s) => s.hydrated);
  const order = useMimi((s) => s.orders.find((o) => o.id === orderId));

  if (!hydrated) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-lg px-4 py-32 text-center">
          <p className="text-sm text-muted">Plating your receipt…</p>
        </div>
      </SiteShell>
    );
  }

  if (!order) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-lg px-4 py-32 text-center">
          <h1 className="font-display text-4xl">We can't find that order.</h1>
          <Button asChild className="mt-8">
            <Link to="/track">Track another</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-8 md:pt-32">
        <p className="text-[11px] tracking-label text-brand">Order #{order.id}</p>
        <h1 className="mt-3 font-display text-5xl leading-tight md:text-7xl">
          {order.fulfillment === "pickup" ? "We'll see you soon." : "Your food is on the way."}
        </h1>
        <p className="mt-4 text-muted">
          Estimated {order.fulfillment === "pickup" ? "ready in" : "arrival"} {order.etaMinutes} minutes.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <TrackingTimeline status={order.status} fulfillment={order.fulfillment} />
          <div>
            <ul className="space-y-3 text-sm">
              {order.items.map((l) => (
                <li key={l.lineId} className="flex justify-between gap-3">
                  <span>
                    {l.quantity}× {l.name}
                  </span>
                  <span className="tabular-nums">{formatNaira(lineTotal(l))}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex justify-between font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatNaira(order.total)}</span>
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/track/$orderId" params={{ orderId: order.id }}>
              Track order
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/menu">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
