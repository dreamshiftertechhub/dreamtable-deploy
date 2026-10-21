import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OCCASIONS, type ReservationStatus } from "@/data/types";
import { useMimi } from "@/store/use-mimi";

export const Route = createFileRoute("/admin/reservations")({ component: AdminReservations });

function AdminReservations() {
  const list = useMimi((s) => s.reservations);
  const update = useMimi((s) => s.updateReservation);
  const today = "2026-10-02";
  const todays = list.filter((r) => r.date === today);
  const upcoming = list.filter((r) => r.date > today);

  return (
    <div>
      <p className="text-[11px] tracking-label text-brand">The book</p>
      <h1 className="mt-2 font-display text-4xl">Reservations</h1>
      <Block title="Today" rows={todays} update={update} />
      <Block title="Upcoming" rows={upcoming} update={update} />
    </div>
  );
}

function Block({
  title,
  rows,
  update,
}: {
  title: string;
  rows: ReturnType<typeof useMimi.getState>["reservations"];
  update: (id: string, status: ReservationStatus) => void;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Quiet book.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-medium">
                  {r.name} · {r.guests} covers
                </p>
                <p className="text-sm text-muted">
                  {r.date} {r.time} · {OCCASIONS.find((o) => o.id === r.occasion)?.label} · #{r.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={r.status === "confirmed" ? "ok" : r.status === "pending" ? "warn" : "outline"}>
                  {r.status}
                </Badge>
                {r.status !== "confirmed" && (
                  <Button size="sm" variant="outline" onClick={() => update(r.id, "confirmed")}>
                    Confirm
                  </Button>
                )}
                {r.status !== "cancelled" && (
                  <Button size="sm" variant="ghost" onClick={() => update(r.id, "cancelled")}>
                    Cancel
                  </Button>
                )}
                {r.status !== "completed" && (
                  <Button size="sm" variant="ghost" onClick={() => update(r.id, "completed")}>
                    Complete
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
