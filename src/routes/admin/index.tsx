import { createFileRoute } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/data/types";
import { formatNaira, formatTime } from "@/lib/format";
import { useMimi } from "@/store/use-mimi";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const orders = useMimi((s) => s.orders);
  const update = useMimi((s) => s.updateOrderStatus);
  const today = orders.filter((o) => o.status !== "cancelled");
  const sales = today.reduce((s, o) => s + (o.status === "cancelled" ? 0 : o.total), 0);
  const preparing = orders.filter((o) => o.status === "preparing").length;
  const out = orders.filter((o) => o.status === "out-for-delivery").length;
  const done = orders.filter((o) => o.status === "delivered").length;

  return (
    <div>
      <p className="text-[11px] tracking-label text-brand">Tonight's service</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">The pass</h1>
      <div className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Today's sales" value={formatNaira(sales)} />
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Preparing" value={String(preparing)} />
        <Stat label="Out for delivery" value={String(out)} />
        <Stat label="Completed" value={String(done)} />
      </div>

      <h2 className="mt-14 font-display text-2xl">Tickets</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-[11px] tracking-label text-muted">
            <tr className="border-b border-line">
              <th className="py-3 font-semibold">Order</th>
              <th className="py-3 font-semibold">Customer</th>
              <th className="py-3 font-semibold">Items</th>
              <th className="py-3 font-semibold">Amount</th>
              <th className="py-3 font-semibold">Status</th>
              <th className="py-3 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line">
                <td className="py-3 font-medium">{o.id}</td>
                <td className="py-3">{o.customer.name}</td>
                <td className="py-3 text-muted">
                  {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                </td>
                <td className="py-3 tabular-nums">{formatNaira(o.total)}</td>
                <td className="py-3">
                  <Select
                    value={o.status}
                    onValueChange={(v) => update(o.id, v as OrderStatus)}
                  >
                    <SelectTrigger className="h-10 w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {ORDER_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-3 text-muted">{formatTime(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
