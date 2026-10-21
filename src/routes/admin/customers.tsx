import { createFileRoute } from "@tanstack/react-router";
import { formatNaira } from "@/lib/format";
import { useMimi } from "@/store/use-mimi";

export const Route = createFileRoute("/admin/customers")({ component: AdminCustomers });

function AdminCustomers() {
  const orders = useMimi((s) => s.orders);
  const reservations = useMimi((s) => s.reservations);
  const map = new Map<
    string,
    { name: string; phone: string; orders: number; spend: number; reservations: number }
  >();
  for (const o of orders) {
    const key = o.customer.phone || o.customer.name;
    const cur = map.get(key) ?? {
      name: o.customer.name,
      phone: o.customer.phone,
      orders: 0,
      spend: 0,
      reservations: 0,
    };
    cur.orders += 1;
    cur.spend += o.total;
    map.set(key, cur);
  }
  for (const r of reservations) {
    const key = r.phone || r.name;
    const cur = map.get(key) ?? {
      name: r.name,
      phone: r.phone,
      orders: 0,
      spend: 0,
      reservations: 0,
    };
    cur.reservations += 1;
    map.set(key, cur);
  }
  const guests = [...map.values()].sort((a, b) => b.spend - a.spend);

  return (
    <div>
      <p className="text-[11px] tracking-label text-brand">Front of house</p>
      <h1 className="mt-2 font-display text-4xl">Guests</h1>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-[11px] tracking-label text-muted">
            <tr className="border-b border-line">
              <th className="py-3 font-semibold">Name</th>
              <th className="py-3 font-semibold">Phone</th>
              <th className="py-3 font-semibold">Orders</th>
              <th className="py-3 font-semibold">Spend</th>
              <th className="py-3 font-semibold">Reservations</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.phone} className="border-b border-line">
                <td className="py-3">{g.name}</td>
                <td className="py-3">{g.phone}</td>
                <td className="py-3 tabular-nums">{g.orders}</td>
                <td className="py-3 tabular-nums">{formatNaira(g.spend)}</td>
                <td className="py-3 tabular-nums">{g.reservations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
