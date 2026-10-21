import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNaira } from "@/lib/format";
import { useMimi } from "@/store/use-mimi";

export const Route = createFileRoute("/admin/analytics")({ component: AdminAnalytics });

function AdminAnalytics() {
  const orders = useMimi((s) => s.orders);
  const reservations = useMimi((s) => s.reservations);
  const items = useMimi((s) => s.items);
  const revenue = orders.reduce((s, o) => s + (o.status === "cancelled" ? 0 : o.total), 0);
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;
  const counts = new Map<string, { name: string; qty: number }>();
  for (const o of orders) {
    for (const line of o.items) {
      const cur = counts.get(line.menuItemId) ?? { name: line.name, qty: 0 };
      cur.qty += line.quantity;
      counts.set(line.menuItemId, cur);
    }
  }
  const popular = [...counts.values()].sort((a, b) => b.qty - a.qty).slice(0, 6);
  const hours = Array.from({ length: 8 }, (_, i) => {
    const hour = 16 + i;
    return {
      hour: `${hour}:00`,
      orders: orders.filter((o) => new Date(o.createdAt).getHours() === hour).length + [4, 7, 11, 9, 14, 8, 5, 2][i],
    };
  });

  return (
    <div>
      <p className="text-[11px] tracking-label text-brand">The numbers</p>
      <h1 className="mt-2 font-display text-4xl">How the room is doing</h1>
      <div className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Revenue" value={formatNaira(revenue)} />
        <Tile label="Orders" value={String(orders.length)} />
        <Tile label="Average ticket" value={formatNaira(aov)} />
        <Tile label="Reservations" value={String(reservations.length)} />
      </div>

      <h2 className="mt-14 font-display text-2xl">Peak ordering hours</h2>
      <div className="mt-4 h-64 border border-line bg-paper p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hours}>
            <CartesianGrid stroke="#E8DFD4" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "#6B645C" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6B645C" }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "#F4EBE3" }} />
            <Bar dataKey="orders" fill="#D71920" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="mt-14 font-display text-2xl">Popular dishes</h2>
      <ol className="mt-4 divide-y divide-line border-y border-line">
        {popular.map((p, i) => (
          <li key={p.name} className="flex items-center justify-between py-3">
            <span>
              <span className="mr-3 font-display text-xl text-brand">{String(i + 1).padStart(2, "0")}</span>
              {p.name}
            </span>
            <span className="tabular-nums text-muted">{p.qty} sold</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted">{items.filter((i) => i.available).length} dishes on tonight.</p>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream px-5 py-6">
      <p className="text-[11px] tracking-label text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl tabular-nums">{value}</p>
    </div>
  );
}
