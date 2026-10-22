import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bike, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/data/types";
import { formatNaira, formatTime } from "@/lib/format";
import { listHouseOrders, setHouseOrderStatus } from "@/lib/house.functions";
import { cn } from "@/lib/utils";
import { useMimi } from "@/store/use-mimi";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

const COLUMNS: { id: OrderStatus; hint: string }[] = [
  { id: "new", hint: "Just landed" },
  { id: "confirmed", hint: "Accepted" },
  { id: "preparing", hint: "On the fire" },
  { id: "ready", hint: "At the pass" },
  { id: "out-for-delivery", hint: "With the rider" },
  { id: "delivered", hint: "Closed" },
];

const FLOW: OrderStatus[] = ["new", "confirmed", "preparing", "ready", "out-for-delivery", "delivered"];

function nextStatus(order: Order): OrderStatus | null {
  if (order.status === "cancelled" || order.status === "delivered") return null;
  if (order.status === "ready" && order.fulfillment === "pickup") return "delivered";
  const index = FLOW.indexOf(order.status);
  return FLOW[index + 1] ?? null;
}

function nextLabel(order: Order) {
  const next = nextStatus(order);
  if (!next) return null;
  if (next === "confirmed") return "Accept";
  if (next === "preparing") return "Send to kitchen";
  if (next === "ready") return "Mark ready";
  if (next === "out-for-delivery") return "Send rider";
  if (next === "delivered" && order.fulfillment === "pickup") return "Handed over";
  if (next === "delivered") return "Mark delivered";
  return ORDER_STATUS_LABELS[next];
}

function age(iso: string, now: number) {
  const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function AdminHome() {
  const local = useMimi((s) => s.orders);
  const update = useMimi((s) => s.updateOrderStatus);
  const [remote, setRemote] = useState<Order[]>([]);
  const [overrides, setOverrides] = useState<Record<string, OrderStatus>>({});
  const [query, setQuery] = useState("");
  const [lane, setLane] = useState<"all" | "delivery" | "pickup">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let live = true;
    async function load() {
      try {
        const rows = await listHouseOrders();
        if (live) setRemote(rows);
      } catch {
        /* local tickets still run the board */
      }
    }
    void load();
    const poll = window.setInterval(() => void load(), 8000);
    const clock = window.setInterval(() => setNow(Date.now()), 30000);
    return () => {
      live = false;
      window.clearInterval(poll);
      window.clearInterval(clock);
    };
  }, []);

  const orders = useMemo(() => {
    const map = new Map<string, Order>();
    for (const order of remote) map.set(order.id, order);
    for (const order of local) map.set(order.id, { ...map.get(order.id), ...order });
    return [...map.values()]
      .map((order) => (overrides[order.id] ? { ...order, status: overrides[order.id] } : order))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [local, remote, overrides]);

  const visible = orders.filter((order) => {
    if (lane !== "all" && order.fulfillment !== lane) return false;
    const hay = `${order.id} ${order.customer.name} ${order.customer.phone} ${order.items.map((i) => i.name).join(" ")}`.toLowerCase();
    return hay.includes(query.trim().toLowerCase());
  });

  const open = visible.filter((order) => order.status !== "delivered" && order.status !== "cancelled");
  const sales = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const selected = orders.find((order) => order.id === openId) ?? null;

  function move(order: Order, status: OrderStatus) {
    setOverrides((current) => ({ ...current, [order.id]: status }));
    update(order.id, status);
    setRemote((rows) => rows.map((row) => (row.id === order.id ? { ...row, status } : row)));
    void setHouseOrderStatus({ data: { id: order.id, status } });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-label text-brand">Kitchen</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Order board</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Every ticket from the floor, the website, and signed-in guests. Move it as the plate leaves the pass.
          </p>
        </div>
        <p className="text-[11px] tracking-label text-muted">Live · refreshes every few seconds</p>
      </div>

      <div className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open tickets" value={String(open.length)} />
        <Stat label="On the road" value={String(orders.filter((o) => o.status === "out-for-delivery").length)} />
        <Stat label="Sales on the board" value={formatNaira(sales)} />
        <Stat label="Cancelled" value={String(orders.filter((o) => o.status === "cancelled").length)} />
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, phone, dish, or order"
          aria-label="Search orders"
          className="md:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["delivery", "Delivery"],
              ["pickup", "Pickup"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setLane(id)}
              className={cn(
                "h-11 px-4 text-[11px] font-semibold tracking-label",
                lane === id ? "bg-ink text-cream" : "bg-white text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const tickets = visible.filter((order) => order.status === column.id);
          return (
            <section key={column.id} className="w-72 shrink-0 bg-white">
              <header className="flex items-baseline justify-between border-b border-line px-4 py-3">
                <div>
                  <h2 className="font-medium">{ORDER_STATUS_LABELS[column.id]}</h2>
                  <p className="text-xs text-muted">{column.hint}</p>
                </div>
                <span className="font-display text-2xl tabular-nums">{tickets.length}</span>
              </header>
              <ul className="space-y-3 p-3">
                {tickets.length === 0 && <li className="px-1 py-6 text-sm text-muted">Nothing here.</li>}
                {tickets.map((order) => {
                  const action = nextLabel(order);
                  const next = nextStatus(order);
                  return (
                    <li key={order.id} className={cn("border border-line p-3", openId === order.id && "border-brand")}>
                      <button type="button" className="w-full text-left" onClick={() => setOpenId(order.id)}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold tracking-label">{order.id}</span>
                          <span className="text-xs text-muted">{age(order.createdAt, now)}</span>
                        </div>
                        <p className="mt-2 font-medium">{order.customer.name}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                          {order.fulfillment === "delivery" ? <Bike className="size-3.5" /> : <Store className="size-3.5" />}
                          {order.fulfillment === "delivery" ? "Delivery" : "Pickup"} · {formatNaira(order.total)}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-muted">
                          {order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}
                        </p>
                      </button>
                      {action && next && (
                        <Button className="mt-3 w-full" size="sm" onClick={() => move(order, next)}>
                          {action}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {visible.some((order) => order.status === "cancelled") && (
        <p className="mt-2 text-sm text-muted">
          {visible.filter((order) => order.status === "cancelled").length} cancelled — hidden from the live columns.
        </p>
      )}

      {selected && (
        <article className="mt-8 border border-line bg-white p-5 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-label text-brand">{ORDER_STATUS_LABELS[selected.status]}</p>
              <h2 className="mt-2 font-display text-3xl">{selected.id}</h2>
              <p className="mt-1 text-sm text-muted">
                Placed {formatTime(selected.createdAt)} · {age(selected.createdAt, now)} ago
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {nextStatus(selected) && (
                <Button onClick={() => move(selected, nextStatus(selected)!)}>{nextLabel(selected)}</Button>
              )}
              {selected.status !== "cancelled" && selected.status !== "delivered" && (
                <Button variant="outline" onClick={() => move(selected, "cancelled")}>
                  Cancel ticket
                </Button>
              )}
            </div>
          </div>
          <ol className="mt-6 flex flex-wrap gap-2">
            {FLOW.map((status) => {
              const reached = FLOW.indexOf(status) <= FLOW.indexOf(selected.status) && selected.status !== "cancelled";
              return (
                <li
                  key={status}
                  className={cn(
                    "px-3 py-2 text-[11px] font-semibold tracking-label",
                    reached ? "bg-ink text-cream" : "bg-cream text-muted",
                  )}
                >
                  {ORDER_STATUS_LABELS[status]}
                </li>
              );
            })}
          </ol>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-[11px] tracking-label text-muted">Guest</p>
              <p className="mt-2 font-medium">{selected.customer.name}</p>
              <p className="text-sm text-muted">{selected.customer.phone}</p>
              <p className="mt-2 text-sm">
                {selected.fulfillment === "delivery" ? selected.customer.address : "Pickup at the restaurant"}
              </p>
              {selected.customer.apartment && <p className="text-sm text-muted">{selected.customer.apartment}</p>}
              {selected.customer.instructions && (
                <p className="mt-2 text-sm text-muted">Note: {selected.customer.instructions}</p>
              )}
            </div>
            <div>
              <p className="text-[11px] tracking-label text-muted">Ticket</p>
              <ul className="mt-2 space-y-1 text-sm">
                {selected.items.map((item) => (
                  <li key={item.lineId}>
                    {item.quantity}× {item.name}
                    {item.notes ? <span className="text-muted"> — {item.notes}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] tracking-label text-muted">Bill</p>
              <p className="mt-2 text-sm">Subtotal {formatNaira(selected.subtotal)}</p>
              <p className="text-sm">Delivery {formatNaira(selected.deliveryFee)}</p>
              <p className="text-sm">Discount {formatNaira(selected.discount)}</p>
              <p className="mt-2 font-medium">Total {formatNaira(selected.total)}</p>
              <p className="mt-2 text-sm capitalize text-muted">
                {selected.payment}
                {selected.promoCode ? ` · ${selected.promoCode}` : ""}
              </p>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream px-5 py-6">
      <p className="text-[11px] tracking-label text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl tabular-nums">{value}</p>
    </div>
  );
}
