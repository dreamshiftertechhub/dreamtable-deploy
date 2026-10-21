import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveMap } from "@/components/order/live-map";
import { TrackingTimeline } from "@/components/order/timeline";
import { ORDER_STATUS_LABELS } from "@/data/types";
import { formatNaira } from "@/lib/format";
import { useMimi } from "@/store/use-mimi";

export const Route = createFileRoute("/track/$orderId")({ component: TrackPage });

function TrackPage() {
  const { orderId } = Route.useParams();
  const hydrated = useMimi((s) => s.hydrated);
  const order = useMimi((s) => s.orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase()));

  if (!hydrated) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-lg px-4 py-32">
          <p className="text-sm text-muted">Finding your order…</p>
        </div>
      </SiteShell>
    );
  }

  if (!order) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-lg px-4 py-32">
          <h1 className="font-display text-4xl">Nothing matched that craving.</h1>
          <p className="mt-3 text-muted">We couldn't find order #{orderId}.</p>
          <Button asChild className="mt-8">
            <Link to="/track">Try another number</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="pt-16">
        <LiveMap status={order.status} />
      </div>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-12 md:px-8">
        <div className="md:col-span-7">
          <p className="text-[11px] tracking-label text-brand">Order #{order.id}</p>
          <h1 className="mt-2 font-display text-5xl">Where's my food?</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge variant="brand">{ORDER_STATUS_LABELS[order.status]}</Badge>
            <span className="text-sm text-muted">ETA {order.etaMinutes - 3}–{order.etaMinutes + 5} minutes</span>
          </div>
          {order.rider && (
            <p className="mt-6 text-sm">
              Rider <strong>{order.rider.name}</strong> · {order.rider.vehicle}
            </p>
          )}
          <div className="mt-10">
            <TrackingTimeline status={order.status} fulfillment={order.fulfillment} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {order.rider && (
              <Button asChild variant="outline">
                <a href={`tel:${order.rider.phone}`}>
                  <Phone className="size-4" /> Call rider
                </a>
              </Button>
            )}
            <Button asChild variant="ghost">
              <a href="tel:+2342013301840">Contact support</a>
            </Button>
          </div>
        </div>
        <aside className="md:col-span-5">
          <div className="border border-line p-6">
            <p className="text-[11px] tracking-label text-muted">In the bag</p>
            <ul className="mt-4 space-y-3 text-sm">
              {order.items.map((l) => (
                <li key={l.lineId} className="flex gap-3">
                  <img src={l.image} alt="" className="size-14 object-cover" />
                  <span>
                    {l.quantity}× {l.name}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex justify-between text-sm font-semibold">
              Total <span className="tabular-nums">{formatNaira(order.total)}</span>
            </p>
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}
